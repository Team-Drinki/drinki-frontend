# 배포된 백엔드 연동 시 로그인 후 다시 /login으로 튕기는 문제

## 증상

프론트를 로컬(`localhost:3000`)에서 실행하고, 배포된 백엔드(Cloud Run)를 바라보게 설정한 상태에서 Google 로그인을 완료해도 곧바로 `/login`으로 다시 리다이렉트됨.

## 원인 — 쿠키가 브라우저에서 백엔드 도메인에 붙지 않음

`src/api/instance.ts`는 원래 클라이언트(브라우저)에서 호출할 때 절대 URL이 아니라 상대 경로 `/api/v1`을 사용했다:

```ts
// 수정 전
const API_BASE_URL = typeof window === 'undefined' ? `${API_ORIGIN}/api/v1` : '/api/v1';
```

이 상대 경로는 `next.config.ts`의 `rewrites()`를 통해 `localhost:3000` → 백엔드로 서버 사이드 프록시된다:

```ts
// next.config.ts
async rewrites() {
  return [{ source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` }];
},
```

### 왜 문제가 되는가

로그인 흐름:

1. `loginWithGoogle()`이 `window.location.href`로 **백엔드 도메인(Cloud Run)에 직접 이동**해서 로그인 진행
2. 백엔드가 로그인 성공 후 `accessToken` / `refreshToken` httpOnly 쿠키를 설정 — 이 쿠키는 **Cloud Run 도메인**에 저장됨 (예: `drinki-api-xxxx.a.run.app`)
3. 백엔드가 `CLIENT_URL`(`http://localhost:3000`)로 리다이렉트

이후 인증 확인 흐름:

4. `getCurrentUser()`가 `/api/v1/users/my`를 호출 — 이 요청은 (상대경로이므로) 브라우저 기준 `localhost:3000`으로 나감
5. 브라우저는 쿠키를 **요청 대상 호스트명 기준**으로 붙이는데, 이 쿠키는 `drinki-api-xxxx.a.run.app`에 저장되어 있고 요청은 `localhost:3000`으로 가기 때문에 **쿠키가 실리지 않음**
6. Next.js rewrite가 서버 사이드에서 백엔드로 프록시하지만, 애초에 브라우저가 쿠키를 안 실었으므로 백엔드는 미인증으로 판단 → 401
7. 프론트는 이를 "로그인 안 됨"으로 해석 → `/login`으로 리다이렉트

로컬 개발 환경(백엔드도 `localhost:8000`)에서는 문제가 없었던 이유: 쿠키는 **호스트명**만 보고 포트는 구분하지 않기 때문에, `localhost:8000`에서 설정된 쿠키도 `localhost:3000` 요청에 그대로 실렸음. 백엔드를 Cloud Run으로 옮기면서 호스트명 자체가 달라져 이 우연한 동작이 깨진 것.

### 백엔드는 크로스 도메인 인증을 위해 이미 준비되어 있었음

`drinki-backend-ts`의 CORS/쿠키 설정 확인 결과, 이미 정상 구성되어 있었다:

- CORS: `origin: config.CLIENT_URL` (`http://localhost:3000`), `credentials: true`
- 쿠키: `NODE_ENV=production`(Cloud Run Dockerfile에서 설정)일 때 `sameSite: "none", secure: true`
- OAuth 콜백 후 리다이렉트: `CLIENT_URL=http://localhost:3000` (정상)

즉 백엔드는 이미 크로스 도메인 요청 + 쿠키 전송을 허용하도록 되어 있었고, 문제는 순전히 프론트가 같은 오리진인 척 프록시를 거쳐 요청을 보내던 방식에 있었다.

**해결:** 클라이언트 요청도 프록시를 거치지 않고 백엔드 origin으로 직접 보내도록 변경.

```ts
// 수정 후 — src/api/instance.ts
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_URL = `${API_ORIGIN}/api/v1`;
```

이렇게 하면 브라우저가 실제로 Cloud Run 도메인에 요청을 보내게 되고, 그 도메인에 저장된 쿠키가 정상적으로 실려서 인증이 유지된다.

## 참고 — 로컬 백엔드로 되돌릴 때

프론트/백엔드를 둘 다 로컬(`localhost`)에서 돌릴 경우에는 두 방식(직접 요청 vs 프록시) 모두 정상 동작한다. 호스트명이 같은 `localhost`이기 때문. 배포된 백엔드를 계속 쓸 계획이라면 `instance.ts`의 직접 요청 방식을 유지해야 한다.
