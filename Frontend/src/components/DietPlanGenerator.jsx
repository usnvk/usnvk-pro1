import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const DietPlanGenerator = () => {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    vegOrNonveg: 'vegetarian',
    prakriti: 'Vata',
    healthGoal: 'Maintain Weight',
    allergies: '',
    specificConcerns: ''
  });
  const [dietChart, setDietChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/generate/user/dietchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const backendError = errorData?.error || `API returned status ${response.status}`;
        throw new Error(backendError);
      }

      const data = await response.json();
      if (!data || !data.diet_plan || !data.diet_plan.meals) {
        setError('The backend did not return a valid diet plan. Please try again or check the backend logs.');
        setDietChart(null);
        return;
      }
      setDietChart(data.diet_plan);
    } catch (err) {
      console.error('API call failed:', err);
      setError(err.message || 'Failed to generate diet chart. Please check the backend server.');
      setDietChart(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl border border-teal-200">
        <h1 className="text-4xl font-bold text-center text-teal-800 mb-2">Ayurvedic Diet Planner</h1>
        <p className="text-center text-teal-600 mb-8">Personalize your diet with AI-powered Ayurvedic principles.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2m0-12a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 5.292a4 4 0 110 5.292M12 4.354a4 4 0 100 5.292m0 5.292a4 4 0 100 5.292M12 4.354V12m0 5.292V12m0 0a4.001 4.001 0 00-4 4.001A4.001 4.001 0 0012 21a4.001 4.001 0 004-4.001A4.001 4.001 0 0012 13z" />
                </svg>
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.999 1.999 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner md:col-span-2">
              <label htmlFor="vegOrNonveg" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                Diet Type
              </label>
              <div className="mt-2 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, vegOrNonveg: 'vegetarian' })}
                  className={`flex items-center px-4 py-2 rounded-full border transition-colors ${
                    formData.vegOrNonveg === 'vegetarian'
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-teal-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20C10 20 5 17 5 12C5 7 10 4 10 4C10 4 15 7 15 12C15 17 10 20 10 20Z"></path><path d="M5 12H19C19 12 19 12 19 12"></path></svg>
                  Vegetarian
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, vegOrNonveg: 'non-vegetarian' })}
                  className={`flex items-center px-4 py-2 rounded-full border transition-colors ${
                    formData.vegOrNonveg === 'non-vegetarian'
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-teal-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16.7V4.3C21 3.58 20.32 3 19.5 3H4.5C3.68 3 3 3.58 3 4.3V16.7C3 17.42 3.68 18 4.5 18H19.5C20.32 18 21 17.42 21 16.7Z"></path><path d="M10 21H14"></path><path d="M12 18V21"></path></svg>
                  Non-Vegetarian
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="prakriti" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 5.292a4 4 0 110 5.292M12 4.354a4 4 0 100 5.292m0 5.292a4 4 0 100 5.292M12 4.354V12m0 5.292V12m0 0a4.001 4.001 0 00-4 4.001A4.001 4.001 0 0012 21a4.001 4.001 0 004-4.001A4.001 4.001 0 0012 13z" />
                </svg>
                Ayurvedic Prakriti (Dosha)
              </label>
              <select
                id="prakriti"
                name="prakriti"
                value={formData.prakriti}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="Vata">Vata</option>
                <option value="Pitta">Pitta</option>
                <option value="Kapha">Kapha</option>
                <option value="Vata-Pitta">Vata-Pitta</option>
                <option value="Pitta-Kapha">Pitta-Kapha</option>
                <option value="Kapha-Vata">Kapha-Vata</option>
                <option value="Tridosha">Tridosha</option>
              </select>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="healthGoal" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Health Goal
              </label>
              <select
                id="healthGoal"
                name="healthGoal"
                value={formData.healthGoal}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
              </select>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-teal-500 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Activity Level
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="low">Low (Sedentary)</option>
                <option value="moderate">Moderate</option>
                <option value="high">High (Active)</option>
              </select>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma-separated)</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              placeholder="e.g., peanuts, gluten, dairy"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner">
            <label htmlFor="specificConcerns" className="block text-sm font-medium text-gray-700 mb-1">Specific Health Concerns</label>
            <textarea
              id="specificConcerns"
              name="specificConcerns"
              value={formData.specificConcerns}
              onChange={handleInputChange}
              rows="3"
              placeholder="e.g., high blood pressure, diabetes, weak digestion"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generate Diet Plan'
            )}
          </button>
        </form>

        <Transition
          show={error !== ''}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {error && (
            <div className="mt-8 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
        </Transition>

        {dietChart && dietChart.meals && Array.isArray(dietChart.meals) && (
          <div className="mt-8 p-6 bg-teal-50 rounded-xl border border-teal-200 shadow-lg">
            <h2 className="text-3xl font-bold text-teal-800 mb-4 text-center">Your Personalized Diet Chart</h2>
            <div className="space-y-6">
              {dietChart.explanation && (
                <div className="bg-white p-4 rounded-lg shadow border border-teal-100">
                  <h3 className="text-xl font-semibold text-teal-700">Explanation</h3>
                  <p className="mt-2 text-gray-600">{dietChart.explanation}</p>
                </div>
              )}
              {dietChart.meals.map((meal, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border border-teal-100">
                  <h3 className="text-xl font-semibold text-teal-700">{meal.meal_time}</h3>
                  <p className="text-sm text-gray-500">Tastes: <span className="font-medium">{Array.isArray(meal.tastes) ? meal.tastes.join(', ') : ''}</span></p>
                  <ul className="mt-2 space-y-2">
                    {Array.isArray(meal.items) && meal.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        <span className="font-medium text-teal-600">{item.name}</span> - {item.quantity}
                        <span className="text-sm text-gray-500 ml-2">({Array.isArray(item.properties) ? item.properties.join(', ') : ''})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        <a href="https://react.dev/link/react-devtools" target="_blank" rel="noopener noreferrer" className="underline">
          Download the React DevTools
        </a>
      </p>
    </div>
  );
};

export default DietPlanGenerator;
