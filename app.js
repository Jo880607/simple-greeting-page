const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const apiRoutes = require('./src/routes/api');
const indexRoutes = require('./src/routes/index');
const rateLimiter = require('./src/middleware/rateLimiter');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 미들웨어
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS 설정
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// 압축 및 파싱
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (캐싱 설정)
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '1h',
  etag: true,
  lastModified: true
}));

// API 요청 제한
app.use('/api', rateLimiter);

// 라우트 설정
app.use('/api', apiRoutes);
app.use('/', indexRoutes);

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Page not found',
    message: '요청한 페이지를 찾을 수 없습니다.' 
  });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  logger.error('Server Error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    message: '서버 오류가 발생했습니다.'
  });
});

// 서버 시작
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;