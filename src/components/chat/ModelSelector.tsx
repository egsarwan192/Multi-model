'use client';

import { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { Model } from '@/types/chat';
import { MODELS, getAllModels } from '@/lib/openrouter';
import clsx from 'clsx';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelId: string) => void;
  currentModel: string;
}

export default function ModelSelector({
  isOpen,
  onClose,
  onSelectModel,
  currentModel,
}: ModelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allModels = getAllModels();
  const filteredModels = allModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Select Model
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Models List */}
          <div className="max-h-96 overflow-y-auto p-6">
            {Object.entries(MODELS).map(([provider, models]) => {
              const providerModels = models.filter(model =>
                model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                model.provider.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (providerModels.length === 0) return null;

              return (
                <div key={provider} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 capitalize">
                    {provider}
                  </h3>
                  <div className="grid gap-2">
                    {providerModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          onClose();
                        }}
                        className={clsx(
                          'w-full text-left p-3 rounded-lg border transition-all duration-200',
                          'hover:bg-gray-50 dark:hover:bg-gray-700',
                          'border-gray-200 dark:border-gray-600',
                          currentModel === model.id
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-white dark:bg-gray-800'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {model.name}
                                </span>
                                {model.free && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                    <Sparkles className="w-3 h-3" />
                                    Free
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {model.provider}
                              </div>
                            </div>
                          </div>
                          {currentModel === model.id && (
                            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredModels.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No models found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Free models are available without cost. Paid models require an OpenRouter account with credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}