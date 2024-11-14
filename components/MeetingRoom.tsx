import React, { useState } from 'react'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {

    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');

    const 

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
            <div className='flex size-full max-w-[1000px] items-center'>
                
            </div>
      </div>
    </section>
  )
}

export default MeetingRoom
