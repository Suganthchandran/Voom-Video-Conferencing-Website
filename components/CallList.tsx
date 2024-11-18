"use client"

import { useGetCalls } from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/node-sdk';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from '@/hooks/use-toast';

const CallList = ({type}: {type: 'ended' | 'upcoming' | 'recordings'}) => {

    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
    const router = useRouter();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const {toast} = useToast();

    const getCalls = () => {
      console.log('upcomingCalls:', upcomingCalls);
      switch ( type ) {
        case 'ended':
          return endedCalls;
        case 'recordings':
          return recordings;
        case 'upcoming':
          return upcomingCalls;
        default:
          return [];
      }
    }

    const getNoCallsMessage = () => {
      switch ( type ) {
        case 'ended':
          return 'No Previous Calls';
        case 'recordings':
          return 'No Recordings';
        case 'upcoming':
          return 'No Upcoming calls';
        default:
          return [];
      }
    }

    useEffect(()=>{
        const fetchRecordings = async () => {

          try {
            const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))
            const recordings = callData
              .filter(call => call.recordings.length > 0)
              .flatMap(call => call.recordings)
        // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              setRecordings(recordings);
          }
          catch(error) {
            console.log(error)
            toast({ title: 'Try Again Later'})
          }
        }

        if(type === 'recordings') fetchRecordings()
    },[type, toast, callRecordings])

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader/>

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {
          calls && calls.length > 0 
          ?
          calls.map((meeting : Call | CallRecording, index)=>(
            <MeetingCard
            // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              key={meeting.id || `meeting-${index}`}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type == 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
              }
              // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              title={(meeting as Call).state?.custom.desc.substring(0,26) || meeting.filename.substring(0,20) || 'No description'}
              // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
              isPreviousMeeting={ type === 'ended' }
              buttonIcon1={ type == 'recordings' ? '/icons/play.svg' : undefined}
              buttonText={ type == 'recordings' ? 'Play' : 'Start'}
              // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              handleClick={ type === 'recordings' ? ()=> router.push(`${meeting.url}`) : ()=> router.push(`/meeting/${meeting.id}`)}
              // @ts-expect-error: Reason why you're ignoring this error (optional comment)
              link={ type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
            />
          ))
          :
          (
            <h1>{noCallsMessage}</h1>
          )
        }
    </div>
  )
}

export default CallList
