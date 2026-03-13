# 🧪 코코의 종합 QA 검토 리포트

**검토자:** 코코 (QA 테스트 담당)  
**검토일:** 2026. 03. 13.  
**검토 범위:** 기획서 + 백엔드 코드 + 프론트엔드 코드  

---

## 1. 📋 기획 vs 구현 일치도 검토

### ✅ 일치사항
- 팀원 프로필 표시 기능 ✓
- 역할별 필터링 기능 ✓
- 반응형 디자인 구조 ✓
- 브랜딩 컬러 적용 ✓

### ❌ 불일치 발견사항
1. **기획서의 DB 스키마 vs 백엔드 미구현**
   - 멍뭉이 제안한 MySQL 스키마가 유키 백엔드에 미반영
   - `projects` 테이블, `page_views` 테이블 누락

2. **검색 기능 (P1) 누락**
   - 기획서에 P1으로 명시된 검색창이 프론트엔드에서 구현되지 않음

3. **포트폴리오/SNS 링크 연동 미완성**
   - 기획서 P1 기능이지만 데이터만 있고 실제 링크 동작 미구현

4. **다국어 지원 (P2) 준비 부족**
   - 기획서에 한/영/중/일 지원 명시했으나 구조적 준비 없음

---

## 2. 🔍 코드 리뷰 (버그 & 보안취약점)

### 🚨 Critical Issues

#### Backend (유키 작업)
```javascript
// ❌ SQL Injection 취약점
app.get('/api/members/:id', (req, res) => {
  const query = `SELECT * FROM members WHERE id = ${req.params.id}`;
  // 파라미터 바인딩 없이 직접 삽입 - 매우 위험!
});

// ❌ 에러 핸들링 부족
app.get('/api/members', (req, res) => {
  // try-catch 없음, 에러 시 서버 크래시 가능
});

// ❌ CORS 설정 누락
// 프론트엔드에서 API 호출 시 CORS 에러 발생 예상
```

#### Frontend (푸딩 작업)
```jsx
// ❌ API 에러 핸들링 부족
const fetchMembers = async () => {
  const response = await fetch('/api/members');
  const data = await response.json(); // 에러 체크 없음
  setMembers(data);
};

// ❌ XSS 취약점 가능성
<div dangerouslySetInnerHTML={{__html: member.detailed_intro}} />
// 사용자 입력 데이터를 직접 렌더링 - 위험

// ❌ 무한 렌더링 위험
useEffect(() => {
  fetchMembers();
}, [members]); // members가 dependency로 들어가서 무한 루프
```

### ⚠️ Performance Issues
1. **이미지 최적화 부족**
   - Next.js Image 컴포넌트 미사용
   - lazy loading 미적용

2. **번들 크기 최적화 필요**
   - Framer Motion 전체 import
   - 불필요한 아이콘 라이브러리 전체 로드

---

## 3. 🧪 기능별 테스트 시나리오

| 기능 | 테스트 케이스 | 예상 결과 | 우선순위 |
|------|--------------|-----------|---------|
| **팀원 목록 로드** | 페이지 첫 접근 | 전체 팀원 4명 표시 | P0 |
| **역할별 필터링** | "개발" 필터 클릭 | 개발자 2명만 표시 | P0 |
| **모바일 반응형** | 화면 너비 375px | 카드 1열 배치 | P0 |
| **프로필 모달** | 팀원 카드 클릭 | 상세 정보 모달 오픈 | P1 |
| **외부 링크** | GitHub 아이콘 클릭 | 새 탭에서 GitHub 오픈 | P1 |
| **다크모드** | 테마 토글 버튼 | 색상 테마 변경 | P2 |
| **검색 기능** | 이름으로 검색 | 해당 팀원만 표시 | P1 |
| **로딩 상태** | API 응답 지연 시 | 스켈레톤 UI 표시 | P1 |

---

## 4. 🌐 E2E 테스트 시나리오

### Scenario 1: 신규 방문자 여정
```
1. 페이지 접속 (https://winter-sunshine.com)
2. 히어로 섹션 애니메이션 확인
3. "팀원 보기" CTA 버튼 클릭
4. 팀원 그리드로 스크롤 이동
5. "개발" 필터 선택
6. 유키 프로필 카드 클릭
7. 모달에서 GitHub 링크 클릭
8. 외부 사이트 정상 오픈 확인
9. 모달 닫기 후 다른 팀원 탐색
```

### Scenario 2: 모바일 사용자 여정
```
1. 모바일 디바이스로 접속
2. 햄버거 메뉴 동작 확인
3. 터치 제스처로 팀원 카드 스와이프
4. 포트폴리오 링크 터치 확인
5. 뒤로가기 버튼 동작 확인
```

### Scenario 3: 에러 상황 처리
```
1. 네트워크 연결 끊김 상태에서 접속
2. 에러 메시지 표시 확인
3. 재시도 버튼 동작 확인
4. 일부 이미지 로드 실패 시 fallback 확인
```

---

## 5. 📱 크로스브라우저/모바일 체크리스트

### Desktop Browsers
- [ ] Chrome 120+ (최신)
- [ ] Firefox 121+ (최신)
- [ ] Safari 17+ (macOS)
- [ ] Edge 120+ (Windows)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS 15+)
- [ ] Samsung Internet
- [ ] Firefox Mobile

### 화면 해상도 테스트
- [ ] 1920x1080 (Desktop FHD)
- [ ] 1366x768 (Laptop)
- [ ] 768x1024 (Tablet)
- [ ] 375x667 (Mobile)
- [ ] 390x844 (iPhone 14)

### 기능별 브라우저 호환성
| 기능 | Chrome | Firefox | Safari | Edge | 이슈 |
|------|--------|---------|--------|------|------|
| CSS Grid | ✅ | ✅ | ✅ | ✅ | - |
| Flexbox | ✅ | ✅ | ✅ | ✅ | - |
| Framer Motion | ⚠️ | ⚠️ | ❌ | ⚠️ | Safari 일부 애니메이션 깨짐 |
| Modern JS | ✅ | ✅ | ⚠️ | ✅ | Safari 구버전 이슈 |

---

## 6. ⚡ 성능 & 접근성 체크리스트

### 성능 최적화 체크
- [ ] Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms  
  - [ ] CLS < 0.1
- [ ] 이미지 최적화 (WebP 지원)
- [ ] 코드 스플리팅 적용
- [ ] 캐싱 전략 구현
- [ ] 번들 크기 분석

### 접근성 (WCAG 2.1) 체크
- [ ] 키보드 네비게이션 가능
- [ ] 스크린 리더 호환성
- [ ] Alt 텍스트 제공
- [ ] 색상 대비 4.5:1 이상
- [ ] Focus indicator 명확
- [ ] Semantic HTML 사용

---

## 7. 🐛 발견된 버그 리포트

### Critical Bugs (🔴 즉시 수정 필요)
1. **SQL Injection 취약점** - Backend
   - 영향도: 전체 데이터베이스 보안
   - 담당자: 유키

2. **CORS 에러** - Backend
   - 영향도: API 호출 전체 실패
   - 담당자: 유키

3. **무한 렌더링** - Frontend
   - 영향도: 페이지 성능 저하, 브라우저 크래시
   - 담당자: 푸딩

### Major Bugs (🟡 배포 전 수정)
4. **에러 핸들링 부족** - Frontend/Backend
   - API 실패 시 사용자에게 적절한 피드백 없음

5. **이미지 로딩 최적화** - Frontend
   - 큰 이미지 파일로 인한 로딩 지연

6. **검색 기능 누락** - Frontend
   - 기획 P1 기능 미구현

### Minor Issues (🟢 추후 개선)
7. **다크모드 준비** - Frontend
8. **다국어 구조 설계** - Frontend
9. **애니메이션 Safari 호환성** - Frontend

---

## 8. 📝 팀원별 수정 요청사항

### 🎯 유키(백엔드)에게 긴급 수정 요청

```typescript
// 🚨 1. SQL Injection 수정 (Critical)
app.get('/api/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM members WHERE id = ? AND is_active = true';
    const [rows] = await db.execute(query, [id]); // 파라미터 바인딩 필수!
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🚨 2. CORS 설정 추가
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 🚨 3. 입력 검증 미들웨어 추가
const { body, validationResult } = require('express-validator');

app.post('/api/members', [
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('email').isEmail(),
  body('role').isIn(['기획', '개발', '마케팅'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // 처리 로직...
});
```

### 🍮 푸딩(프론트엔드)에게 수정 요청

```jsx
// 🚨 1. API 에러 핸들링 수정 (Critical)
const fetchMembers = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/members');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setMembers(data);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    setError('팀원 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};

// 🚨 2. useEffect 의존성 수정 (Critical)
useEffect(() => {
  fetchMembers();
}, []); // members 제거, 빈 배열로 변경

// 🚨 3. XSS 방지를 위한 DOMPurify 적용
import DOMPurify from 'dompurify';

const MemberCard = ({ member }) => {
  const sanitizedContent = DOMPurify.sanitize(member.detailed_intro);
  
  return (
    <div 
      dangerouslySetInnerHTML={{__html: sanitizedContent}}
    />
  );
};

// 🟡 4. 이미지 최적화 (Major)
import Image from 'next/image';

const ProfileImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    width={300}
    height={300}
    placeholder="blur"
    blurDataURL="/images/blur-placeholder.jpg"
    {...props}
  />
);

// 🟡 5. 검색 기능 구현 (Major)
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="팀원 이름을 검색해보세요"
        