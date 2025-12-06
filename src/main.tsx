import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import FinancialReportPage from './pages/FinancialReportPage'
import BusinessAnalyticsPage from './pages/BusinessAnalyticsPage'
import ReceiptUploadPage from './pages/ReceiptUploadPage'
import AIPosterGeneratorPage from './pages/AIPosterGeneratorPage'
import WhatsAppPage from './pages/WhatsAppPage'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/financial-report" element={<FinancialReportPage />}/>
        <Route path="/dashboard/business-analytics" element={<BusinessAnalyticsPage />}/>
        <Route path="/dashboard/receipt-upload" element={<ReceiptUploadPage />}/>
        <Route path="/dashboard/poster-generator" element={<AIPosterGeneratorPage />}/>
        <Route path="/dashboard/whatsapp" element={<WhatsAppPage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
