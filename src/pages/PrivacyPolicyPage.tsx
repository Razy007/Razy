import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <Logo size={40} />
          <div>
            <h1 className="text-white font-bold text-lg">Privacy Policy</h1>
            <p className="text-yellow-400 text-xs">Academy of Pi</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Privacy Policy</h1>
          <p className="text-white/70 mb-8">
            <strong>Effective Date:</strong> January 7, 2025<br />
            <strong>Last Updated:</strong> January 7, 2025
          </p>

          <div className="space-y-8 text-white/90">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to <strong>Academy of Pi</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform within the Pi Network ecosystem.
              </p>
              <p>
                By accessing or using Academy of Pi, you agree to the terms outlined in this Privacy Policy. If you do not agree with our policies and practices, please do not use our application.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">2.1 Information from Pi Network</h3>
              <p className="mb-4">
                When you authenticate with Pi Network, we receive the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li><strong>User ID (UID):</strong> Your unique Pi Network identifier</li>
                <li><strong>Username:</strong> Your Pi Network username</li>
                <li><strong>Payment Authorization:</strong> Permissions to facilitate Pi cryptocurrency transactions</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">2.2 Learning Progress Data</h3>
              <p className="mb-4">
                We collect information about your learning activities:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Course completions and progress</li>
                <li>Quiz scores and answers</li>
                <li>Experience points (XP) earned</li>
                <li>Badges and achievements unlocked</li>
                <li>Study time and engagement metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">2.3 Financial Data</h3>
              <p className="mb-4">
                We track your in-app financial activities:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Pi cryptocurrency balance within the app</li>
                <li>Transaction history (purchases, rewards, staking)</li>
                <li>Staking positions and rewards</li>
                <li>Energy purchases and usage</li>
              </ul>
              <p className="text-yellow-400 text-sm mb-4">
                ⚠️ <strong>Important:</strong> We do NOT store your Pi Network wallet private keys or passphrase. Your wallet remains non-custodial and fully under your control.
              </p>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">2.4 Social Interaction Data</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Posts, comments, and community interactions</li>
                <li>Referral data and referral code usage</li>
                <li>Profile picture (optional, stored locally)</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">2.5 Technical Data</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Device type and browser information</li>
                <li>IP address (for security purposes)</li>
                <li>App usage statistics and error logs</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for the following purposes:</p>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.1 Core Functionality</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Authenticate your identity via Pi Network</li>
                <li>Track your learning progress and achievements</li>
                <li>Calculate and distribute rewards (XP, Pi)</li>
                <li>Process in-app purchases and transactions</li>
                <li>Manage staking positions and rewards</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.2 Personalization</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Customize course recommendations</li>
                <li>Adapt difficulty based on performance</li>
                <li>Remember your language preference (French/English)</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.3 Analytics & Improvement</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Analyze app usage to improve features</li>
                <li>Monitor performance and fix bugs</li>
                <li>Understand learning patterns to create better content</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.4 Communication</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Send important app updates and notifications</li>
                <li>Respond to support requests</li>
                <li>Notify you of achievements and milestones</li>
              </ul>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage & Security</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">4.1 Local Storage</h3>
              <p className="mb-4">
                Most of your data is stored locally on your device using browser localStorage. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>User progress and achievements</li>
                <li>Pi balance (synchronized with blockchain)</li>
                <li>Profile picture (if uploaded)</li>
                <li>Language preference</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">4.2 Cloud Backup (Optional)</h3>
              <p className="mb-4">
                For users who authenticate with Pi Network, we offer optional cloud backup using Firebase:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Encrypted user progress data</li>
                <li>Cross-device synchronization</li>
                <li>Backup of social posts and comments</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">4.3 Security Measures</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>✅ <strong>HTTPS encryption</strong> for all data transmission</li>
                <li>✅ <strong>Non-custodial wallet</strong> - We never store your private keys</li>
                <li>✅ <strong>Access controls</strong> - Your data is accessible only by you</li>
                <li>✅ <strong>Regular security audits</strong> and updates</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing & Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.1 We DO NOT Sell Your Data</h3>
              <p className="mb-4 text-yellow-400 font-semibold">
                Academy of Pi will NEVER sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.2 Sharing with Pi Network</h3>
              <p className="mb-4">
                We share minimal information with Pi Network ecosystem:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Transaction data for Pi payments (required for blockchain)</li>
                <li>App usage metrics (anonymized, for ecosystem analytics)</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.3 Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required by law:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>To prevent fraud or illegal activities</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
              <p className="mb-4">You have the following rights regarding your data:</p>
              
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li><strong>Access:</strong> View all data we have about you</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a readable format</li>
                <li><strong>Opt-out:</strong> Disable optional data collection features</li>
              </ul>

              <p className="mb-4">
                To exercise these rights, contact us at: <a href="mailto:privacy@pioneeracademy.academy" className="text-yellow-400 hover:underline font-semibold">privacy@pioneeracademy.academy</a>
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
              <p className="mb-4">
                Academy of Pi is intended for users aged <strong>13 and older</strong>. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
              <p className="mb-4">
                Academy of Pi operates globally within the Pi Network ecosystem. Your data may be transferred to and stored in countries outside your country of residence, including countries that may have different data protection laws.
              </p>
              <p className="mb-4">
                By using our app, you consent to the transfer of your information to these countries. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies & Tracking</h2>
              <p className="mb-4">
                Academy of Pi uses minimal tracking technologies:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li><strong>Local Storage:</strong> To save your progress and preferences</li>
                <li><strong>Session Data:</strong> To maintain your login state</li>
                <li><strong>Analytics (Anonymized):</strong> To understand app usage patterns</li>
              </ul>
              <p className="mb-4">
                We do NOT use third-party advertising cookies or trackers.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. When we make significant changes, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Update the "Last Updated" date at the top of this policy</li>
                <li>Notify you via in-app notification</li>
                <li>Request your consent if required by law</li>
              </ul>
              <p className="mb-4">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
              </p>
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <p className="font-semibold text-yellow-400">Academy of Pi - Privacy Team</p>
                <p className="text-white/90 mt-2">
                  <strong>Email:</strong> <a href="mailto:privacy@pioneeracademy.academy" className="text-yellow-400 hover:underline">privacy@pioneeracademy.academy</a><br />
                  <strong>Support:</strong> <a href="mailto:support@pioneeracademy.academy" className="text-yellow-400 hover:underline">support@pioneeracademy.academy</a><br />
                  <strong>Website:</strong> https://www.pioneeracademy.academy
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
              <p>© 2025 Academy of Pi. All rights reserved.</p>
              <p className="mt-2">Part of the Pi Network Ecosystem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
