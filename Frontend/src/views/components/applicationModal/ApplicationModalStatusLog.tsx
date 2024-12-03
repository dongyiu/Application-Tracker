// src/views/components/applicationModal/StatusLog.tsx
import { Calendar, ChevronRight } from 'lucide-react';
import type { ApplicationModalViewModel } from '@/viewModels/ApplicationModalViewModel';
import { Application } from '@/core/domain/models/Application';
import { observer } from 'mobx-react-lite';

interface ApplicationModalStatusLogProps {
  updatedApplication: Application;
  viewModel: ApplicationModalViewModel;
}

export const ApplicationModalStatusLog = observer(({
  updatedApplication,
  viewModel
}: ApplicationModalStatusLogProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-400">Status Log</h3>
      </div>
      
      <div className="space-y-3">
        {updatedApplication.logs.slice().reverse().map((log) => (
          <div 
            key={log.id}
            className={`bg-[#282c34] rounded-xl border border-gray-800/50
                      transition-all duration-200 
                      ${log.emailId ? 'cursor-pointer hover:bg-gray-800/50 hover:border-gray-700/50' : ''}`}
            onClick={() => log.emailId && viewModel.toggleLogExpansion(log.id)}
          >
            <div className="flex items-start gap-4 p-4">
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium text-gray-300">
                  {viewModel.formatDate(log.date)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.date).getFullYear()}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {log.fromStage ? (
                      <>
                        Moved from <span className="text-gray-400">{log.fromStage}</span> to{' '}
                        <span className="text-gray-400">{log.toStage}</span>
                      </>
                    ) : (
                      log.message
                    )}
                  </p>
                  {log.emailId && (
                    <ChevronRight
                      className={`h-4 w-4 text-gray-400 transform transition-transform duration-200
                              ${viewModel.expandedLogs.has(log.id) ? 'rotate-90' : ''}`}
                    />
                  )}
                </div>
                {log.emailId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Source Email: "{log.emailTitle}"
                  </p>
                )}
              </div>
            </div>

            {log.emailId && viewModel.expandedLogs.has(log.id) && (
              <div className="px-4 pb-4 border-t border-gray-700/50 mt-2">
                <div className="bg-[#1a1d24] rounded-lg p-4 mt-3">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {log.emailBody}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});