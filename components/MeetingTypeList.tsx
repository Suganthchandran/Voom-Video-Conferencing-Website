"use client"

import { useRouter } from 'next/navigation';
import HomeCard from "./HomeCard"
import { useState } from "react"
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"

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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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

       {!callDetails ? (
          <MeetingModal
               isOpen={meetingState === 'isScheduleMeeting'}
               onClose={()=> setMeetingState(undefined)}
               title="Create Meeting"
               handleClick={createMeeting}
          >
               <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky'>Add a description</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{
                         setValues({...values, desc: e.target.value})
                    }} />
               </div>
               <div className="flex w-full flex-col gap-2.5">
                    <label className='text-base text-normal leading-[22px] text-sky'>Select Date and Time</label>
                    <ReactDatePicker
                         selected={values.dateTime}
                         onChange={(date) => setValues({...values, dateTime: date!})}
                         showTimeSelect
                         timeFormat='HH:mm'
                         timeIntervals={15}
                         timeCaption='time'
                         dateFormat="MMMM d, yyyy h:mm aa"
                         className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                    />
               </div>
          </MeetingModal>
       ) : (
          <MeetingModal
               isOpen={meetingState === 'isScheduleMeeting'}
               onClose={()=> setMeetingState(undefined)}
               title="Meeting Created"
               className="text-center"
               handleClick={()=> {
                    navigator.clipboard.writeText(meetingLink);
                    toast({ title: 'Link Copied'})
               }}
               image="/icons/checked.svg"
               buttonIcon="icons/copy.svg"
               buttonText="Copy Meeting Link"
       />
       )}

       <MeetingModal
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={()=> setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
       />

       <MeetingModal
          isOpen={meetingState === 'isJoiningMeeting'}
          onClose={()=> setMeetingState(undefined)}
          title="Type the Link Here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={()=> router.push(values.link)}
       >
          <Input 
            placeholder='Meeting Link'
            className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e)=> setValues({ ...values, link: e.target.value })}
          />

       </MeetingModal>

    </section>
  )
}

export default MeetingTypeList
