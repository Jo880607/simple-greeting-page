### UI/UX 요구사항
1. **컬러팔레트:**
   - Primary: #4F46E5 (인디고)
   - Secondary: #F59E0B (앰버)
   - Text: #1F2937 (그레이-800)
   - Background: #F9FAFB (그레이-50)

2. **애니메이션:**
   - 카드 hover: 살짝 올라오는 효과 (translateY: -4px)
   - 필터 전환: fade-in/out (300ms)
   - 모달 열기: scale + fade 조합

3. **반응형 브레이크포인트:**
   - Mobile: 320px ~ 768px
   - Tablet: 768px ~ 1024px
   - Desktop: 1024px+

4. **접근성:**
   - 키보드 네비게이션 지원
   - alt 텍스트 필수
   - color contrast 4.5:1 이상

### 주요 기능별 상세 가이드

#### MemberCard 컴포넌트