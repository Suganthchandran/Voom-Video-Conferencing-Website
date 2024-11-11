import React from 'react'

const Meeting = async ({params}: {params: Promise<{id : String}>}) => {
  const id = (await params).id
  return (
    <div>
        Meeting Room: #{id}
    </div>
  )
}

export default Meeting
