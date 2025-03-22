import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow px-4 py-5 sm:px-6 mb-6 rounded-lg">
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý kho vải
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý thông tin vải, kho vải, và các hoạt động liên quan đến vải
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Xuất báo cáo
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Tìm kiếm nâng cao
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 