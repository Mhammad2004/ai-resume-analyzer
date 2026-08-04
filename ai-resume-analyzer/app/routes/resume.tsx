import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { usePuterStore } from '~/lib/puter'
import Summary from '~/components/Summary'
import Ats from '~/components/Ats'
import Details from '~/components/Details'

export const meta = () => ([
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed Overview of your resume' },
])

const resume = () => {
    const { fs, auth, isLoading, kv } = usePuterStore();
    const { id } = useParams();


    const [imageUrl, setImageUrl] = useState(" ")
    const [resumeUrl, setResumeUrl] = useState(" ")
    const [feedback, setFeedbackUrl] = useState <Feedback | null>(null)

    const navigate = useNavigate()

    //IF user isnt logged in it will redirect him to log in page
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)

            if (!resume) return;

            const data = JSON.parse(resume)

            const resumeBLOB = await fs.read(data.resumePATh)
            if (!resumeBLOB) return;
            const pdfBLOB = new Blob([resumeBLOB], { type: 'application/pdf' })
            const resumeUrl = URL.createObjectURL(pdfBLOB)
            setResumeUrl(resumeUrl)


            const imageBLOB = await fs.read(data.imagePath)
            if (!imageBLOB) return;
            const imageUrl = URL.createObjectURL(imageBLOB);
            setImageUrl(imageUrl)

            setFeedbackUrl(data.feedback)

            console.log({ imageUrl, resumeUrl, feedback: data.feedback })

        }
        loadResume()
    }, [id])

    return (
        <main className='!pt-0'>
            <nav className='resume-nav'>
                <Link to={"/"} className='back-button'>
                    <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5' />
                    <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center]">
                    {imageUrl && resumeUrl && (
                        <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-1 h-[90%] max-wxl:h-fit w-fit'>
                            <a href={resumeUrl} target='_blank' rel="noopener noreferrer">

                                <img
                                    src={imageUrl}
                                    className='w-full h-full object-contain rounded-2xl '
                                    title='resume'
                                />
                            </a>
                        </div>
                    )}
                </section>

                <section className='feedback-section'>
                    <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
                    {feedback ?
                        (
                            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>Summary ATS Details
                            <Summary feedback={feedback} ></Summary>
                            <Ats score={feedback.ATS.score || 0 }  suggestions={feedback.ATS.tips || []} ></Ats>
                            <Details feedback={feedback}></Details>
                            </div>
                        ) :
                        (
                            <img src="/images/resume-scan-2.gif" className='w-full' alt="" />
                        )}
                </section>

            </div>
        </main>)
}

export default resume
