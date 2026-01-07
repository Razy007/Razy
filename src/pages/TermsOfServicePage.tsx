import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If no history (direct access), go to home
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl p-4 sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <Logo size={40} />
          <div>
            <h1 className="text-white font-bold text-lg">Terms of Service</h1>
            <p className="text-yellow-400 text-xs">Academy of Pi</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Terms of Service</h1>
          <p className="text-white/70 mb-8">
            <strong>Effective Date:</strong> January 7, 2025<br />
            <strong>Last Updated:</strong> January 7, 2025
          </p>

          <div className="space-y-8 text-white/90">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                Welcome to <strong>Academy of Pi</strong> ("we," "our," "us," or "the Platform"). By accessing or using our educational platform within the Pi Network ecosystem, you agree to be bound by these Terms of Service ("Terms").
              </p>
              <p className="mb-4">
                If you do not agree to these Terms, please do not use the Platform. We reserve the right to modify these Terms at any time, and your continued use of the Platform constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
              <p className="mb-4">
                To use Academy of Pi, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Be at least <strong>13 years old</strong></li>
                <li>Have a valid <strong>Pi Network account</strong></li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not be prohibited from using the Platform under any applicable law</li>
              </ul>
              <p className="mb-4">
                By using the Platform, you represent and warrant that you meet these eligibility requirements.
              </p>
            </section>

            {/* Account Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Account & User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.1 Pi Network Authentication</h3>
              <p className="mb-4">
                Academy of Pi uses Pi Network authentication. Your account security is YOUR responsibility:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Keep your Pi Network credentials secure</li>
                <li><strong>NEVER share your wallet passphrase</strong> with anyone</li>
                <li>Notify us immediately if you suspect unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.2 Prohibited Activities</h3>
              <p className="mb-4">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Create multiple accounts to abuse rewards or referral system</li>
                <li>Use bots, scripts, or automated tools to gain unfair advantages</li>
                <li>Share quiz answers or manipulate learning progress</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post spam, offensive, or illegal content</li>
                <li>Attempt to hack, reverse-engineer, or exploit the Platform</li>
                <li>Violate Pi Network's terms of service or community guidelines</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">3.3 Content You Post</h3>
              <p className="mb-4">
                When you post content on Academy of Pi (comments, social posts, etc.):
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>You retain ownership of your content</li>
                <li>You grant us a license to display and distribute your content within the Platform</li>
                <li>You are responsible for ensuring your content does not violate any laws or rights</li>
                <li>We reserve the right to remove content that violates these Terms</li>
              </ul>
            </section>

            {/* Educational Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Educational Services</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">4.1 Course Content</h3>
              <p className="mb-4">
                Academy of Pi provides educational courses about:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Pi Network fundamentals</li>
                <li>Blockchain technology</li>
                <li>Cryptocurrency concepts</li>
                <li>Security best practices</li>
                <li>Decentralized finance (DeFi)</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">4.2 No Guarantees</h3>
              <p className="mb-4">
                While we strive for accuracy, we make NO warranties about:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>The completeness or accuracy of course content</li>
                <li>Your ability to profit from knowledge gained</li>
                <li>Future value of Pi cryptocurrency</li>
                <li>Exam or certification outcomes (if applicable)</li>
              </ul>
              <p className="text-yellow-400 font-semibold mb-4">
                ⚠️ Educational content is for informational purposes only and does not constitute financial advice.
              </p>
            </section>

            {/* Pi Cryptocurrency & Rewards */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Pi Cryptocurrency & Rewards</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.1 Earning Pi Rewards</h3>
              <p className="mb-4">
                You can earn Pi cryptocurrency on Academy of Pi by:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Completing courses and quizzes</li>
                <li>Participating in learning activities</li>
                <li>Referring new users (referral program)</li>
                <li>Engaging with the community</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.2 Reward Distribution</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Rewards are subject to verification and anti-fraud checks</li>
                <li>We reserve the right to adjust or revoke rewards obtained fraudulently</li>
                <li>Reward amounts may change based on platform economics</li>
                <li>Rewards are distributed according to Pi Network's blockchain protocols</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.3 Staking & DeFi Features</h3>
              <p className="mb-4">
                Our staking features allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Lock Pi for periods of 7, 30, or 90 days</li>
                <li>Earn APR rewards (5%, 10%, or 15%)</li>
                <li>Unstake early with a 10% penalty on rewards</li>
              </ul>
              <p className="text-yellow-400 font-semibold mb-4">
                ⚠️ <strong>Risk Warning:</strong> Cryptocurrency staking carries risks. Early withdrawal penalties apply. Past performance does not guarantee future results.
              </p>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">5.4 Non-Custodial Wallet</h3>
              <p className="mb-4">
                <strong>Academy of Pi does NOT custody your Pi cryptocurrency.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Your Pi is stored in your own Pi Network wallet</li>
                <li>We NEVER have access to your wallet private keys or passphrase</li>
                <li>You are solely responsible for securing your wallet</li>
                <li>Lost passphrases cannot be recovered by us or anyone</li>
              </ul>
            </section>

            {/* Purchases & Transactions */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. In-App Purchases & Transactions</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">6.1 Energy Shop & Premium</h3>
              <p className="mb-4">
                You can purchase:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Energy refills (to unlock courses faster)</li>
                <li>Premium membership (enhanced features and rewards)</li>
                <li>Cosmetic items (badges, avatars, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">6.2 Payment Terms</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Payments are processed via Pi Network blockchain</li>
                <li>All transactions are final and non-refundable</li>
                <li>Ensure you have sufficient Pi balance before purchasing</li>
                <li>Transaction fees (if any) are borne by the user</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">6.3 Refund Policy</h3>
              <p className="mb-4 font-semibold">
                Due to the nature of blockchain transactions, <strong className="text-yellow-400">refunds are NOT possible</strong> except in cases of:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Proven technical error on our part</li>
                <li>Duplicate transactions caused by platform bugs</li>
              </ul>
              <p className="mb-4">
                Refund requests must be submitted within 48 hours of the transaction to <a href="mailto:support@pioneeracademy.academy" className="text-yellow-400 hover:underline font-semibold">support@pioneeracademy.academy</a>
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">7.1 Our Content</h3>
              <p className="mb-4">
                All content on Academy of Pi (courses, quizzes, text, graphics, logos, etc.) is owned by us or our licensors and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>You may NOT copy, reproduce, or distribute our content without permission</li>
                <li>You may use content for personal, non-commercial learning purposes</li>
                <li>Sharing quiz answers publicly is prohibited</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">7.2 Trademarks</h3>
              <p className="mb-4">
                "Academy of Pi," our logo, and related marks are trademarks of Academy of Pi. Unauthorized use is prohibited.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers & Limitations of Liability</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">8.1 "AS IS" Basis</h3>
              <p className="mb-4">
                Academy of Pi is provided <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Uninterrupted or error-free operation</li>
                <li>Accuracy or completeness of content</li>
                <li>Security or privacy of data</li>
                <li>Compatibility with your device or browser</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">8.2 Limitation of Liability</h3>
              <p className="mb-4">
                To the fullest extent permitted by law, Academy of Pi and its team shall NOT be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Lost Pi cryptocurrency due to user error or negligence</li>
                <li>Financial losses from staking, trading, or investment decisions</li>
                <li>Data loss or corruption</li>
                <li>Third-party actions (hacks, scams, phishing)</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
              <p className="text-yellow-400 font-semibold mb-4">
                ⚠️ <strong>Maximum Liability:</strong> In no event shall our total liability exceed the amount you paid to us in the last 12 months (or $100 USD, whichever is greater).
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
              
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">9.1 By You</h3>
              <p className="mb-4">
                You may stop using Academy of Pi at any time. Your data stored locally will remain until you clear it.
              </p>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">9.2 By Us</h3>
              <p className="mb-4">
                We reserve the right to suspend or terminate your access if you:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Violate these Terms of Service</li>
                <li>Engage in fraudulent or abusive behavior</li>
                <li>Pose a security risk to the Platform or other users</li>
                <li>Violate Pi Network's terms of service</li>
              </ul>

              <h3 className="text-xl font-semibold text-yellow-400 mb-3">9.3 Effect of Termination</h3>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>You lose access to your account and progress</li>
                <li>Pending rewards may be forfeited</li>
                <li>Your Pi cryptocurrency remains in your non-custodial wallet (not affected)</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law & Disputes</h2>
              <p className="mb-4">
                These Terms are governed by the laws of the jurisdiction where Academy of Pi operates, without regard to conflict of law principles.
              </p>
              <p className="mb-4">
                Any disputes arising from these Terms or your use of the Platform shall be resolved through:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>Good faith negotiation</li>
                <li>Mediation (if negotiation fails)</li>
                <li>Binding arbitration (as a last resort)</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to These Terms</h2>
              <p className="mb-4">
                We may update these Terms from time to time. When we make significant changes:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>We will update the "Last Updated" date</li>
                <li>We will notify you via in-app notification</li>
                <li>Continued use of the Platform constitutes acceptance</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have questions or concerns about these Terms, please contact us:
              </p>
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                <p className="font-semibold text-yellow-400">Academy of Pi - Legal Team</p>
                <p className="text-white/90 mt-2">
                  <strong>Email:</strong> <a href="mailto:legal@pioneeracademy.academy" className="text-yellow-400 hover:underline">legal@pioneeracademy.academy</a><br />
                  <strong>Support:</strong> <a href="mailto:support@pioneeracademy.academy" className="text-yellow-400 hover:underline">support@pioneeracademy.academy</a><br />
                  <strong>Website:</strong> https://www.pioneeracademy.academy
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mt-12 bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">13. Acknowledgment</h2>
              <p className="mb-4">
                By using Academy of Pi, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-white/90">
                <li>You have read and understood these Terms of Service</li>
                <li>You agree to be bound by these Terms</li>
                <li>You understand the risks associated with cryptocurrency</li>
                <li>You are solely responsible for your learning outcomes and financial decisions</li>
              </ul>
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

export default TermsOfServicePage;
