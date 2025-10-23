'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useAuth } from '@/contexts/AuthContext';

// TypeScript interfaces
interface Question {
  question_key: string;
  question_text: string;
  question_type: 'short' | 'long' | 'radio';
  options?: string[];
}

interface FormData {
  id: string;
  name: string;
  type: 'solo' | 'team';
  opening_time: string;
  closing_time: string;
  questions: Question[];
  redirect_to?: string;
}

interface FormResponses {
  [key: string]: string;
}

interface SubmissionCheck {
  has_submitted: boolean;
  submission?: {
    id: string;
    submitted_at: string;
  };
}

const DynamicForm = () => {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<FormData | null>(null);
  const [responses, setResponses] = useState<FormResponses>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionCheck['submission']>(undefined);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<number[]>([]);
  const MAX_TEAM_MEMBERS = 3; // 3 additional members + leader = 4 total
  
  // Decorative airplane animation
  const [planes, setPlanes] = useState<{id: number, x: number, y: number, delay: number, scale: number, rotate: number}[]>([]);
  
  useEffect(() => {
    // Create decorative airplane elements
    const newPlanes = [];
    for (let i = 0; i < 5; i++) {
      newPlanes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        scale: 0.5 + Math.random() * 0.5,
        rotate: Math.random() * 360
      });
    }
    setPlanes(newPlanes);
  }, []);

  // Check authentication
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
      // Store the current form URL for redirect after login
      const currentPath = `/form/${formId}`;
      localStorage.setItem('redirect_after_login', currentPath);
      
      // Redirect to login page
      router.push('/login');
    }
  }, [user, authLoading, formId, router]);

  // Fetch form data and load draft
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch(`http://localhost:8000/api/forms/${formId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Form not found');
          }
          throw new Error('Failed to fetch form data');
        }
        
        const data: FormData = await response.json();
        setFormData(data);
        
        // Check if user has already submitted this form
        const token = localStorage.getItem('access_token');
        if (token) {
          const checkResponse = await fetch(
            `http://localhost:8000/api/forms/${formId}/check-submission`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (checkResponse.ok) {
            const checkData: SubmissionCheck = await checkResponse.json();
            if (checkData.has_submitted) {
              setHasSubmitted(true);
              setSubmissionData(checkData.submission);
              
              // If form has redirect_to and user has submitted, redirect them
              if (data.redirect_to) {
                router.push(data.redirect_to);
                return;
              }
            }
          }

          // Try to load saved draft
          const draftResponse = await fetch(
            `http://localhost:8000/api/forms/${formId}/draft`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (draftResponse.ok) {
            const draftData = await draftResponse.json();
            if (draftData.has_draft) {
              // Load team members from draft if form is team type
              if (data.type === 'team') {
                const membersWithData: number[] = [];
                // Check for team members in responses (2, 3, 4)
                for (let i = 2; i <= 4; i++) {
                  // Check if this team member has any data
                  const hasData = ['name', 'roll', 'phone'].some(
                    field => draftData.draft.responses[`team_member_${i}_${field}`]?.trim()
                  );
                  if (hasData) {
                    membersWithData.push(i);
                  }
                }
                
                // Renumber team members sequentially (2, 3, 4...)
                const renumberedResponses: FormResponses = { ...draftData.draft.responses };
                const newTeamMembers: number[] = [];
                
                membersWithData.forEach((oldNum, index) => {
                  const newNum = index + 2; // Start from 2
                  newTeamMembers.push(newNum);
                  
                  // If the number changed, copy data to new keys
                  if (oldNum !== newNum) {
                    const fields = ['name', 'roll', 'phone'];
                    fields.forEach(field => {
                      const oldKey = `team_member_${oldNum}_${field}`;
                      const newKey = `team_member_${newNum}_${field}`;
                      if (renumberedResponses[oldKey]) {
                        renumberedResponses[newKey] = renumberedResponses[oldKey];
                        delete renumberedResponses[oldKey];
                      }
                    });
                  }
                });
                
                setTeamMembers(newTeamMembers);
                setResponses(renumberedResponses);
                console.log('Loaded and renumbered team members from draft:', newTeamMembers);
              } else {
                // Not a team form, just load responses
                setResponses(draftData.draft.responses);
              }
              
              setLastSaved(new Date(draftData.draft.last_saved));
              console.log('Draft loaded:', draftData.draft);
            } else {
              // Initialize empty responses
              const initialResponses: FormResponses = {};
              data.questions.forEach(q => {
                initialResponses[q.question_key] = '';
              });
              setResponses(initialResponses);
            }
          }
        }
        
        // Check if form is open
        const now = new Date();
        const openingTime = new Date(data.opening_time);
        const closingTime = new Date(data.closing_time);
        setIsFormOpen(now >= openingTime && now <= closingTime);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching form:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (formId && user) {
      fetchFormData();
    }
  }, [formId, user, router]);

  // Auto-save draft after 2 seconds of inactivity
  useEffect(() => {
    // Don't save if form is submitted or not loaded yet
    if (hasSubmitted || !formData || !user) return;

    // Check if there's any content to save
    const hasContent = Object.values(responses).some(value => value.trim() !== '');
    if (!hasContent) return;

    const saveDraft = async () => {
      try {
        setIsSavingDraft(true);
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Filter out team members with no data
        const filteredResponses = { ...responses };
        if (formData?.type === 'team') {
          // Check each potential team member (2, 3, 4)
          for (let i = 2; i <= 4; i++) {
            const fields = ['name', 'roll', 'phone'];
            const hasAnyData = fields.some(
              field => responses[`team_member_${i}_${field}`]?.trim()
            );
            
            // If no data for this team member, remove all their fields
            if (!hasAnyData) {
              fields.forEach(field => {
                delete filteredResponses[`team_member_${i}_${field}`];
              });
            }
          }
        }

        await fetch(`http://localhost:8000/api/forms/${formId}/draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            form_id: formId,
            responses: filteredResponses
          })
        });

        setLastSaved(new Date());
        console.log('Draft saved automatically');
      } catch (err) {
        console.error('Error saving draft:', err);
      } finally {
        setIsSavingDraft(false);
      }
    };

    // Set timeout for 2 seconds after last change
    const timeoutId = setTimeout(saveDraft, 1000);

    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [responses, formId, hasSubmitted, formData, user]);

  const handleInputChange = (questionKey: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[questionKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionKey];
        return newErrors;
      });
    }
  };

  const addTeamMember = () => {
    if (teamMembers.length < MAX_TEAM_MEMBERS) {
      setTeamMembers(prev => [...prev, prev.length + 2]); // Start from 2 (leader is 1)
    }
  };

  const removeTeamMember = (memberNumber: number) => {
    setTeamMembers(prev => prev.filter(num => num !== memberNumber));
    // Clear responses for removed team member
    const memberKeys = [`team_member_${memberNumber}_name`, `team_member_${memberNumber}_roll`, 
                        `team_member_${memberNumber}_phone`];
    setResponses(prev => {
      const newResponses = { ...prev };
      memberKeys.forEach(key => delete newResponses[key]);
      return newResponses;
    });
    // Clear validation errors for removed team member
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      memberKeys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    formData?.questions.forEach(question => {
      const value = responses[question.question_key]?.trim();
      if (!value) {
        errors[question.question_key] = 'This field is required';
      }
    });
    
    // Validate team member fields if form is team type
    if (formData?.type === 'team') {
      teamMembers.forEach(memberNum => {
        const fields = ['name', 'roll', 'phone'];
        fields.forEach(field => {
          const key = `team_member_${memberNum}_${field}`;
          const value = responses[key]?.trim();
          if (!value) {
            errors[key] = 'This field is required';
          }
        });
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`http://localhost:8000/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          form_id: formId,
          user_id: user?._id,
          responses
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit form');
      }

      const result = await response.json();
      
      console.log('Form Submission:', {
        formId,
        formName: formData?.name,
        formType: formData?.type,
        user: {
          email: user?.email,
          name: user?.full_name,
          userId: user?._id
        },
        responses,
        timestamp: new Date().toISOString()
      });
      
      alert('Form submitted successfully!');
      
      // If there's a redirect_to, redirect user
      if (result.redirect_to) {
        router.push(result.redirect_to);
      } else {
        // Otherwise, mark as submitted and show success page
        setHasSubmitted(true);
        setSubmissionData({
          id: result.submission_id,
          submitted_at: result.submitted_at
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit form. Please try again.';
      alert(errorMessage);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const hasError = validationErrors[question.question_key];
    const errorClass = hasError ? 'ring-2 ring-red-500' : 'focus-within:ring-2 focus-within:ring-black';
    
    switch (question.question_type) {
      case 'short':
        return (
          <div key={question.question_key} className="mb-6">
            <label 
              htmlFor={question.question_key} 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {question.question_text}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id={question.question_key}
              value={responses[question.question_key] || ''}
              onChange={(e) => handleInputChange(question.question_key, e.target.value)}
              disabled={!isFormOpen}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${errorClass}`}
              placeholder={`Enter your ${question.question_text.toLowerCase()}`}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600">{validationErrors[question.question_key]}</p>
            )}
          </div>
        );
      
      case 'long':
        return (
          <div key={question.question_key} className="mb-6">
            <label 
              htmlFor={question.question_key} 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {question.question_text}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id={question.question_key}
              value={responses[question.question_key] || ''}
              onChange={(e) => handleInputChange(question.question_key, e.target.value)}
              disabled={!isFormOpen}
              rows={5}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-y ${errorClass}`}
              placeholder={`Enter your ${question.question_text.toLowerCase()}`}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600">{validationErrors[question.question_key]}</p>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div key={question.question_key} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {question.question_text}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="space-y-3">
              {question.options?.map((option) => (
                <label 
                  key={option}
                  className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all ${
                    responses[question.question_key] === option 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${!isFormOpen ? 'opacity-50 cursor-not-allowed' : ''} ${hasError ? 'border-red-500' : ''}`}
                >
                  <input
                    type="radio"
                    name={question.question_key}
                    value={option}
                    checked={responses[question.question_key] === option}
                    onChange={(e) => handleInputChange(question.question_key, e.target.value)}
                    disabled={!isFormOpen}
                    className="w-4 h-4 text-black focus:ring-black disabled:cursor-not-allowed"
                  />
                  <span className={`flex-1 ${!isFormOpen ? 'text-gray-500' : ''}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600">{validationErrors[question.question_key]}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + "+00:00").toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });
  };

  // Show loading while checking auth or loading form
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#e5e5dd] flex items-center justify-center">
        <Nav />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              borderRadius: ["20%", "50%", "20%"] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 border-t-4 border-b-4 border-black"
          />
          <p className="mt-6 text-lg">{authLoading ? 'Checking authentication...' : 'Loading form...'}</p>
        </motion.div>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e5e5dd] text-black">
        <Nav />
        <div className="container mx-auto py-12 px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Form</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  // Show "Already Submitted" page if user has submitted and no redirect_to
  if (hasSubmitted && !formData.redirect_to) {
    return (
      <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden relative">
        <Nav />
        
        {/* Decorative airplane elements */}
        {planes.map((plane) => (
          <motion.div
            key={plane.id}
            className="absolute pointer-events-none opacity-10 z-0"
            style={{
              left: `${plane.x}%`,
              top: `${plane.y}%`,
              scale: plane.scale,
              rotate: plane.rotate
            }}
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [0, -10, 0, 10, 0],
              rotate: [plane.rotate, plane.rotate + 5, plane.rotate, plane.rotate - 5, plane.rotate]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: plane.delay,
              ease: "linear"
            }}
          >
            <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor">
              <path d="M110,25 L80,25 L60,10 L10,10 L5,25 L60,40 L80,40 L110,25 Z M115,25 C117.5,25 117.5,30 115,30 L80,30 L80,35 L90,40 L90,45 L70,40 L60,40 L50,45 L50,40 L60,35 L60,30 L5,30 C2.5,30 2.5,25 5,25 L60,25 L60,20 L50,15 L50,10 L70,15 L80,15 L80,25 L115,25 Z" />
            </svg>
          </motion.div>
        ))}

        {/* Technical pattern background */}
        <div className="absolute inset-0 opacity-5 z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <pattern id="circles" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="black" opacity="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>
        
        <div className="container mx-auto py-12 px-4 mt-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-bold mb-4">Form Already Submitted</h1>
              <p className="text-gray-600 mb-6">
                You have already submitted this form. Thank you for your response!
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">{formData.name}</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Submitted by:</strong> {user?.full_name || user?.email}</p>
                  {submissionData && (
                    <p><strong>Submitted at:</strong> {new Date(submissionData.submitted_at).toLocaleString('en-US', {
                      dateStyle: 'long',
                      timeStyle: 'short'
                    })}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e5dd] text-black overflow-hidden relative">
      <Nav />
      
      {/* Decorative airplane elements */}
      {planes.map((plane) => (
        <motion.div
          key={plane.id}
          className="absolute pointer-events-none opacity-10 z-0"
          style={{
            left: `${plane.x}%`,
            top: `${plane.y}%`,
            scale: plane.scale,
            rotate: plane.rotate
          }}
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -10, 0, 10, 0],
            rotate: [plane.rotate, plane.rotate + 5, plane.rotate, plane.rotate - 5, plane.rotate]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: plane.delay,
            ease: "linear"
          }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor">
            <path d="M110,25 L80,25 L60,10 L10,10 L5,25 L60,40 L80,40 L110,25 Z M115,25 C117.5,25 117.5,30 115,30 L80,30 L80,35 L90,40 L90,45 L70,40 L60,40 L50,45 L50,40 L60,35 L60,30 L5,30 C2.5,30 2.5,25 5,25 L60,25 L60,20 L50,15 L50,10 L70,15 L80,15 L80,25 L115,25 Z" />
          </svg>
        </motion.div>
      ))}

      {/* Technical pattern background */}
      <div className="absolute inset-0 opacity-5 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <pattern id="circles" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="black" opacity="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>
      
      <div className="container mx-auto py-12 px-4 mt-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {formData.name}
            </h1>
            {user && (
              <p className="text-sm text-gray-600 mb-3">
                Registering as <span className="font-semibold">{user.full_name || user.email}</span>
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
              <span className="px-3 py-1 bg-white rounded-full border border-gray-300">
                {formData.type === 'team' ? '👥 Team Registration' : '👤 Solo Registration'}
              </span>
              <span className="px-3 py-1 bg-white rounded-full border border-gray-300">
                Form ID: {formData.id}
              </span>
            </div>
          </motion.div>

          {/* Time Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`mb-6 p-4 rounded-lg ${
              isFormOpen 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {isFormOpen ? '✅' : '🔒'}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isFormOpen ? 'text-green-800' : 'text-red-800'}`}>
                  {isFormOpen ? 'Form is currently open' : 'Form is currently closed'}
                </p>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Opens:</strong> {formatDate(formData.opening_time)}</p>
                  <p><strong>Closes:</strong> {formatDate(formData.closing_time)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {formData.type === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
            >
              <p className="font-semibold mb-2">Team Registration Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The team leader (first member) must fill out their own details first.</li>
                <li>You can add up to {MAX_TEAM_MEMBERS} additional team members.</li>
                <li>If your team is incomplete or if you do not have enough members, we will create a team for you.</li>
                <li>Ensure all team members&apos; details are accurate before submission.</li>
                <li>You can remove a team member by clicking the &quot;Remove&quot; button next to their section.</li>
              </ul>
            </motion.div>
          )}

          {/* Draft Status Indicator */}
          {!hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center justify-end gap-2 text-xs text-gray-500"
            >
              {isSavingDraft ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"
                  />
                  <span>Saving draft...</span>
                </>
              ) : lastSaved ? (
                <>
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Draft saved at {new Date(lastSaved).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </>
              ) : null}
            </motion.div>
          )}
          
          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
            >
              <form onSubmit={handleSubmit}>
                {formData.questions.map(question => renderQuestion(question))}
                
                {/* Team Members Section - Only for team forms */}
                {formData.type === 'team' && (
                  <div className="mt-8 mb-6">
                    {/* Render existing team members */}
                    {teamMembers.map((memberNum) => (
                      <motion.div
                        key={memberNum}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-6 border-2 border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Team Member {memberNum}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(memberNum)}
                            disabled={!isFormOpen}
                            className="text-red-500 cursor-pointer hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Name */}
                          <div>
                            <label 
                              htmlFor={`team_member_${memberNum}_name`}
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id={`team_member_${memberNum}_name`}
                              value={responses[`team_member_${memberNum}_name`] || ''}
                              onChange={(e) => handleInputChange(`team_member_${memberNum}_name`, e.target.value)}
                              disabled={!isFormOpen}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                validationErrors[`team_member_${memberNum}_name`] 
                                  ? 'ring-2 ring-red-500' 
                                  : 'focus-within:ring-2 focus-within:ring-black'
                              }`}
                              placeholder="Enter team member name"
                            />
                            {validationErrors[`team_member_${memberNum}_name`] && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors[`team_member_${memberNum}_name`]}</p>
                            )}
                          </div>

                          {/* Roll Number */}
                          <div>
                            <label 
                              htmlFor={`team_member_${memberNum}_roll`}
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Roll Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id={`team_member_${memberNum}_roll`}
                              value={responses[`team_member_${memberNum}_roll`] || ''}
                              onChange={(e) => handleInputChange(`team_member_${memberNum}_roll`, e.target.value)}
                              disabled={!isFormOpen}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                validationErrors[`team_member_${memberNum}_roll`] 
                                  ? 'ring-2 ring-red-500' 
                                  : 'focus-within:ring-2 focus-within:ring-black'
                              }`}
                              placeholder="Enter roll number"
                            />
                            {validationErrors[`team_member_${memberNum}_roll`] && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors[`team_member_${memberNum}_roll`]}</p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label 
                              htmlFor={`team_member_${memberNum}_phone`}
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              id={`team_member_${memberNum}_phone`}
                              value={responses[`team_member_${memberNum}_phone`] || ''}
                              onChange={(e) => handleInputChange(`team_member_${memberNum}_phone`, e.target.value)}
                              disabled={!isFormOpen}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                validationErrors[`team_member_${memberNum}_phone`] 
                                  ? 'ring-2 ring-red-500' 
                                  : 'focus-within:ring-2 focus-within:ring-black'
                              }`}
                              placeholder="Enter phone number"
                            />
                            {validationErrors[`team_member_${memberNum}_phone`] && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors[`team_member_${memberNum}_phone`]}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Team Member Button */}
                    {teamMembers.length < MAX_TEAM_MEMBERS && (
                      <motion.button
                        type="button"
                        onClick={addTeamMember}
                        disabled={!isFormOpen}
                        whileHover={isFormOpen ? { scale: 1.02 } : {}}
                        whileTap={isFormOpen ? { scale: 0.98 } : {}}
                        className={`w-full cursor-pointer py-3 px-4 rounded-md font-semibold border-2 border-dashed transition-colors ${
                          isFormOpen
                            ? 'border-gray-400 text-gray-700 hover:border-black hover:bg-gray-50'
                            : 'border-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-xl">+</span>
                          Add Team Member ({teamMembers.length}/{MAX_TEAM_MEMBERS})
                        </span>
                      </motion.button>
                    )}

                    {teamMembers.length >= MAX_TEAM_MEMBERS && (
                      <div className="text-center text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                        Maximum team size reached (4 members including you)
                      </div>
                    )}
                  </div>
                )}
                
                <motion.button
                  type="submit"
                  disabled={!isFormOpen || isSubmitting}
                  whileHover={isFormOpen && !isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={isFormOpen && !isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full cursor-pointer py-3 px-4 rounded-md font-semibold transition-colors ${
                    isFormOpen && !isSubmitting
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </span>
                  ) : !isFormOpen ? (
                    'Form Closed'
                  ) : (
                    'Submit Form'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>
          
          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            <p>All fields marked with <span className="text-red-500">*</span> are required</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
