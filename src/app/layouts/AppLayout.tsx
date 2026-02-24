import { Outlet } from 'react-router-dom'
import TabBar from '@shared/components/TabBar'

export default function AppLayout() {
  return (
    <div className="mobile-container">
      <main className="pb-16">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
