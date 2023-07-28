import React from 'react'
import MeetingSidebar from '../components/MeetingSidebar'

const LayoutMeeting = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row gap-x-4">
      <aside className="xl:w-96 lg:w-80 lg:block hidden">
        <MeetingSidebar />
      </aside>
      {children}
    </div>
  )
}

export default LayoutMeeting