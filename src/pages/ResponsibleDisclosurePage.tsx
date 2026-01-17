export function ResponsibleDisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Responsible Disclosure Policy</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 space-y-4">
          <p className="text-gray-600">
            At Zipto, we take security seriously. If you discover a security vulnerability, please report it to us responsibly.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 mt-6">Reporting Guidelines</h2>
          <p className="text-gray-600">
            Please email security@zipto.com with details of the vulnerability. We commit to acknowledging your report within 48 hours.
          </p>
          <h2 className="text-xl font-semibold text-gray-900 mt-6">What to Include</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Description of the vulnerability</li>
            <li>Steps to reproduce</li>
            <li>Potential impact</li>
            <li>Any proof of concept code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
