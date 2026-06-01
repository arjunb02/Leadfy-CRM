'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { RightPanel } from './right-panel'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  showRightPanel?: boolean
}

export function DashboardLayout({ children, showRightPanel = false }: DashboardLayoutProps) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(showRightPanel)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 pt-20 md:pt-0 space-y-6">
              {children}
            </div>
          </main>

          {/* Right Panel - Responsive */}
          <div
            className={cn(
              'hidden lg:flex border-l border-border bg-card transition-all duration-300',
              isRightPanelOpen ? 'w-80' : 'w-0'
            )}
          >
            {isRightPanelOpen && <RightPanel />}
          </div>

          {/* Mobile Right Panel Toggle */}
          {isRightPanelOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsRightPanelOpen(false)} />
          )}
          
          {/* Mobile Right Panel */}
          <div
            className={cn(
              'fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-border z-50 lg:hidden',
              'transform transition-transform duration-300',
              isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
              <span className="font-semibold">Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRightPanelOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
