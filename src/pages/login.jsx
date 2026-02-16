import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authStart, authSuccess, authFailure } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../service/firebase";
import logo from "../assets/bragaouiBlack.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      dispatch(
        authSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        })
      );

      navigate("/");
    } catch (err) {
      dispatch(authFailure(err.message));
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-100">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            {" "}
            <img src={logo} alt="App Logo" className="h-16 w-auto  mb-2" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Bienvenue</h1>
          <p className="text-gray-500 text-sm">Connectez-vous pour continuer</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@email.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div className="flex justify-between text-sm">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg shadow hover:bg-indigo-500 transition disabled:opacity-50"
          >
            Se connecter
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline font-medium"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}
