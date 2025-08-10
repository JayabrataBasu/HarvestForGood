export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This Privacy Policy describes how Harvest For Good
              (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects,
              uses, and shares your personal information when you visit or use
              our website and services. We are committed to protecting your
              privacy and ensuring the security of your personal information.
            </p>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Personal identification information (name, email address)</li>
              <li>Contact information and preferences</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To communicate with you about our research and updates</li>
              <li>To improve our website and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy or as required by law. We may share
              information with trusted partners who assist us in operating our
              website and conducting research.
            </p>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of communications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary-dark mb-4 mt-8">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at{" "}
              <a
                href="mailto:harvestforgood01@gmail.com"
                className="text-primary hover:text-primary-dark"
              >
                harvestforgood01@gmail.com
              </a>{" "}
              or through our{" "}
              <a
                href="/contact"
                className="text-primary hover:text-primary-dark"
              >
                contact page
              </a>
              .
            </p>
          </div>

          {/* Placeholder note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Note: Content Placeholder
            </h3>
            <p className="text-green-700"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
