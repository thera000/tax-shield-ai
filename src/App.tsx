import { useState } from 'react';
import type { AppPage, FinancialData, AnalysisReport } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import AnalyzingPage from './components/AnalyzingPage';
import ReportPage from './components/ReportPage';
import MonitorPage from './components/MonitorPage';
import HistoryPage from './components/HistoryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleStartAnalysis = (data: FinancialData) => {
    setFinancialData(data);
  };

  const handleReportReady = (report: AnalysisReport) => {
    setCurrentReport(report);
    setReports(prev => [report, ...prev]);
  };

  const handleViewReport = (report: AnalysisReport) => {
    setCurrentReport(report);
    handleNavigate('report');
  };

  const showHeader = currentPage !== 'analyzing';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header currentPage={currentPage} onNavigate={handleNavigate} />}

      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      {currentPage === 'upload' && (
        <UploadPage onNavigate={handleNavigate} onStartAnalysis={handleStartAnalysis} />
      )}
      {currentPage === 'analyzing' && (
        <AnalyzingPage
          financialData={financialData}
          onNavigate={handleNavigate}
          onReportReady={handleReportReady}
        />
      )}
      {currentPage === 'report' && (
        <ReportPage report={currentReport} onNavigate={handleNavigate} />
      )}
      {currentPage === 'monitor' && (
        <MonitorPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'history' && (
        <HistoryPage
          reports={reports}
          onNavigate={handleNavigate}
          onViewReport={handleViewReport}
        />
      )}
    </div>
  );
}
