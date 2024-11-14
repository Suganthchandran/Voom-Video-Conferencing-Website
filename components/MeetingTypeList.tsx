"use client"

import { useRouter } from 'next/navigation';
import HomeCard from "./HomeCard"
import { useState } from "react"
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/hooks/use-toast"

const MeetingTypeList = () => {

    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
          dateTime: new Date(),
          desc: '',
          link: ''
    });
    const [callDetails, setCallDetails] = useState<Call>();
    const { toast } = useToast()

    const createMeeting = async () => {
          if(!user || !client) return;

          try {

               if(!values.dateTime) {
                    toast({ title: "Please select a date and time", });
                    return;
               }

               const id = crypto.randomUUID();
               const call = client.call('default',id);

               if(!call) throw new Error("Failed to create Call");

               const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
               const desc = values.desc || "Instant Meeting";
               
               await call.getOrCreate({
                    data: {
                         starts_at: startsAt,
                         custom: {
                              desc
                         }
                    }
               })

               setCallDetails(call);

               if(!values.desc) {
                    router.push(`/meeting/${call.id}`)
               }

               toast({ title: "Meeting Created", })
          }
          catch(error) {
               console.log(error)
               toast({ title: "Failed to Create Meeting", })
          }
    }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
       <HomeCard
            img="/icons/add-meeting.svg"
            title="New Meeting"
            desc="Start an instant meeting"
            handleClick={() => setMeetingState('isInstantMeeting')}
            className="bg-orange-1"
       />
       <HomeCard
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            desc="Plan your meeting"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className="bg-blue-1"
       />
       <HomeCard
            img="/icons/recordings.svg"
            title="View Recordings"
            desc="Check out your recordings"
            handleClick={() => router.push('/recordings')}
            className="bg-purple-1"
       />
       <HomeCard
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            desc="via invitation link"
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className="bg-yellow-1"
       />

       <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={()=> setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
       />
    </section>
  )
}

export default MeetingTypeList
