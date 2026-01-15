import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-plague-black px-4">
      <div className="card p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/logo-green.png"
            alt="Plagued"
            className="h-20 mx-auto mb-4"
          />
          <p className="text-plague-mist/60 text-sm uppercase tracking-wider">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="text-plague-mist/80 text-sm uppercase tracking-wider block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@plagueduk.com"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-plague-mist/80 text-sm uppercase tracking-wider block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-plague-red/20 border border-plague-red text-plague-red-bright text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-plague-mist/40 text-xs text-center mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
