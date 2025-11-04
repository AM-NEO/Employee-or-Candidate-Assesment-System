import { RegistrationForm } from "../components/RegistrationForm";

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main container that takes full height minus header/footer */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Form container with curved corners covering most of the page */}
        <div 
          className="h-full rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col"
          style={{ backgroundColor: 'var(--primary-300)' }}
        >
          {/* Header section */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6" style={{ color: 'var(--text-100)' }}>
              <span className="underline decoration-4 underline-offset-8">New Candidate Registration</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-200)' }}>
              Please fill out your details and complete our skills assessment below.
            </p>
          </div>
          
          {/* Form section - takes remaining space */}
          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-5xl">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}