# 최우성 포트폴리오

Flutter·React Native 개발 경력과 회사별 프로젝트를 정리한 사이트입니다. React, TypeScript, Vite, Tailwind CSS와 shadcn/ui로 만들었습니다.

[포트폴리오 보기](https://urusung.github.io/)

## 로컬 실행

Node.js 24에서 다음 명령을 실행합니다.

```sh
npm ci
npm run dev
```

배포 파일을 만들고 확인하려면 다음 명령을 실행합니다.

```sh
npm run build
npm run preview
```

## 경력 내용 수정

`source-data/public-profile.json`에서 회사별 경력, 프로젝트, 월별 작업, 배포 기록과 AI 활용 경험을 수정합니다. 빌드할 때 경력기술서 TXT를 함께 생성합니다.

경력 문구와 집계 수치는 확인한 범위 안에서 작성합니다. 사내 원본 자료, 계정 정보, 내부 링크나 개인정보는 이 저장소에 넣지 않습니다. 빌드에 포함된 검사는 공개 파일 목록과 알려진 비공개 정보 패턴을 확인합니다.

## GitHub Pages 배포

저장소의 Settings → Pages에서 Source를 **GitHub Actions**로 설정합니다. `main` 브랜치에 변경 내용을 올리면 빌드와 파일 검사를 거쳐 배포합니다.

배포 경로는 GitHub Pages 설정에서 가져옵니다. 계정 루트 주소와 프로젝트 하위 경로를 모두 지원합니다. 로컬에서 하위 경로를 확인할 때는 `VITE_BASE_PATH=/portfolio/ npm run build`처럼 지정합니다.

사이트에 별도 로그인 기능은 없습니다. GitHub Pages 주소를 공개하면 방문자가 경력 내용과 TXT 파일을 볼 수 있습니다. 검색 노출은 기존 `noindex,nofollow`와 `robots.txt` 설정을 유지합니다. 이 설정은 접근 권한을 제한하지 않습니다.

## 단일 HTML 내보내기

```sh
python3 build.py --standalone-output /absolute/path/portfolio.html
```

글꼴, 스타일, 경력기술서를 HTML 안에 포함합니다.

## 라이선스

shadcn/ui와 Pretendard의 라이선스는 `LICENSE.shadcn-ui`, `public/licenses/shadcn-ui.txt`, `public/fonts/LICENSE.txt`에 보존했습니다. 경력 문구와 개인 콘텐츠에 대한 별도 오픈소스 라이선스는 부여하지 않았습니다.
