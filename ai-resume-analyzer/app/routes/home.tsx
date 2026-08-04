import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
// import { resumes } from "~/constants/Index";
import Resume from "~/components/Resume";
import { use, useEffect, useState } from "react";
import { Link, Links, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { resume } from "react-dom/server";

export function meta({ }: Route.MetaArgs) {

  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job !" },
  ];
}

export default function Home() {

  const { auth, fs, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([])

  const [LoadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const LoadResumes = async () => {
      setLoadingResumes(true)
      const resumes = (await kv.list('resume:*', true)) as KVItem[]

      const parsedResumes = resumes?.map((resume) => {
        return JSON.parse(resume.value) as Resume;
      });

      console.log("Parsed Resumes", parsedResumes)

      setResumes(parsedResumes || [])
      setLoadingResumes(false)
    }
    LoadResumes()
  }, []);



  //IF user isnt logged in it will redirect him to log in page
  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])



  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Application & Resume Ratings</h1>
        {!LoadingResumes && resumes?.length === 0 ?(
                  <h2>No Resumes found Upload your first resume to get feedback.</h2>

        ):(
          <h2>Review your submissions and check AI powered feedback.</h2>
        )}
      </div>
        {LoadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
          </div>
        )

        }

      {!LoadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) =>
            <Resume key={resume.id} resume={resume}></Resume>
          )}
        </div>
      )}

      {!LoadingResumes && resumes?.length ===0 &&(
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Resume
          </Link>
        </div>
      )}
    </section>

  </main>;
}
