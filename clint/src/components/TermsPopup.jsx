import React from "react";

const TermsPopup = ({ isOpen, setisOpen, setAgreedToTerms }) => {
  if (!isOpen) {
    return null;
  }
  const handleAgreeClick = (e) => {
    setAgreedToTerms(true);
    setisOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-black/30 text-white shadow-2xl backdrop-blur-lg"
      >
        {/* --- Header --- */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-xl font-semibold">Terms & Conditions</h2>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-grow space-y-4 overflow-y-auto p-6 text-gray-300">
          <p className="text-sm">Last updated: October 10, 2025</p>

          <h3 className="text-lg font-semibold text-white">1. User Conduct</h3>
          <p>
            You agree not to use this service to send or post content that is
            harassing, defamatory, illegal, or otherwise objectionable.
            Spamming, phishing, and distributing malware are strictly
            prohibited.
          </p>

          <h3 className="text-lg font-semibold text-white">
            2. Account Responsibility
          </h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account password and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </p>

          <h3 className="text-lg font-semibold text-white">
            3. Content Ownership
          </h3>
          <p>
            You retain ownership of the content you create and share. However,
            by using the service, you grant us a license to use, store, and
            display your content solely for the purpose of operating the
            service.
          </p>

          <h3 className="text-lg font-semibold text-white">
            4. Service Termination
          </h3>
          <p>
            We reserve the right to suspend or terminate your account at any
            time, without notice, for conduct that violates these terms or is
            otherwise harmful to other users or the service.
          </p>
        </div>

        {/* --- Footer --- */}
        <div className="flex flex-shrink-0 items-center justify-end border-t border-white/10 p-4">
          <button
            onClick={handleAgreeClick}
            className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPopup;
