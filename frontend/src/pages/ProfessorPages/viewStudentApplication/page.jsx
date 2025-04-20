import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBarProfessor from '../../../Components/NavBarProfessor';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const ViewStudentApplication = () => {
  const { jobApplicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobApplicationId) {
      setError('No application ID provided.');
      setLoading(false);
      return;
    }

    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${BASE_URL}/JobApplication/one?jobApplicationId=${jobApplicationId}`
        );

        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }

        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [jobApplicationId]);

  const toggleResume = () => setShowResume((prev) => !prev);

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(
        `${BASE_URL}/JobApplication/modify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobApplicationId, status: newStatus }),
        }
      );
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setApplication((app) => ({ ...app, status: newStatus }));
      alert(`Application ${newStatus.toLowerCase()}!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${newStatus.toLowerCase()}`);
    }
  };

  if (loading) return <div className="text-center p-6">Loading…</div>;
  if (error)   return <div className="text-center p-6 text-red-600">{error}</div>;
  if (!application) {
    return <div className="text-center p-6">No application data found.</div>;
  }

  const { student = {}, questions = [], resume = {}, status } = application;
  const { education = [], experience = [], skills = [] } = resume;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBarProfessor />

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex flex-col md:flex-row">
            <aside className="md:w-1/3 bg-orange-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">{student.name || '—'}</h2>
              <p className="text-gray-600">{student.graduation || 'Grad date N/A'}</p>
              <p className="text-gray-600">{student.major     || 'Major N/A'}</p>
              <button
                onClick={toggleResume}
                className="mt-2 text-blue-600 underline focus:outline-none"
              >
                {showResume ? 'Hide Resume' : 'View Resume'}
              </button>
            </aside>

            <section className="md:w-2/3 md:pl-6 mt-6 md:mt-0 space-y-4">
              {questions.length > 0 ? (
                questions.map((q, i) => (
                  <div key={i}>
                    <h3 className="text-md font-semibold">{q.question}</h3>
                    <p className="text-gray-600">{q.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No questions answered.</p>
              )}
            </section>
          </div>

          {showResume && (
            <section className="bg-gray-50 p-6 rounded-lg shadow space-y-6">
              <h3 className="text-lg font-semibold">Resume</h3>

              <div>
                <h4 className="font-semibold">Personal Information</h4>
                <p>Name: {student.name || '—'}</p>
                <p>Email: {student.email || '—'}</p>
                <p>Phone: {student.phone || '—'}</p>
              </div>

              <div>
                <h4 className="font-semibold">Education</h4>
                {education.length > 0 ? (
                  education.map((e, i) => (
                    <p key={i}>
                      {e.degree} — {e.institution} ({e.graduation})
                    </p>
                  ))
                ) : (
                  <p>No education entries.</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold">Experience</h4>
                {experience.length > 0 ? (
                  experience.map((exp, i) => (
                    <div key={i} className="mb-2">
                      <p>{exp.title}, {exp.company} ({exp.duration})</p>
                      {exp.responsibilities?.map((r, j) => (
                        <p key={j} className="ml-4">• {r}</p>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No experience entries.</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold">Skills</h4>
                <p>{skills.length > 0 ? skills.join(', ') : 'No skills listed.'}</p>
              </div>
            </section>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => updateStatus('Accepted')}
              disabled={status !== 'Pending'}
              className={`px-6 py-2 rounded-lg ${
                status !== 'Pending'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-100 hover:bg-green-200'
              }`}
            >
              Accept
            </button>

            <button
              onClick={() => updateStatus('Rejected')}
              disabled={status !== 'Pending'}
              className={`px-6 py-2 rounded-lg ${
                status !== 'Pending'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-100 hover:bg-red-200'
              }`}
            >
              Reject
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewStudentApplication;
