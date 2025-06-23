import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Feed } from './components/Feed';
import { CreatePost } from './components/CreatePost';
import { supabase } from './lib/supabase';
import { Home, PlusSquare, User, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && (
          <nav className="bg-white border-b fixed w-full top-0 z-50">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">Photogram</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-700 hover:text-indigo-600">
                    <Home className="h-6 w-6" />
                  </a>
                  <a href="/create" className="text-gray-700 hover:text-indigo-600">
                    <PlusSquare className="h-6 w-6" />
                  </a>
                  <a href="/profile" className="text-gray-700 hover:text-indigo-600">
                    <User className="h-6 w-6" />
                  </a>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className={`max-w-5xl mx-auto px-4 ${user ? 'pt-20' : ''}`}>
          <Routes>
            <Route
              path="/"
              element={
                user ? <Feed /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/auth"
              element={
                user ? <Navigate to="/" replace /> : <AuthForm />
              }
            />
            <Route
              path="/create"
              element={
                user ? <CreatePost /> : <Navigate to="/auth" replace />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;