import Card from '../shared/Card';
import { panchakarmaGuide } from '../../data/mockData';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

const PanchakarmaGuide = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">Panchakarma Guide</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete guide to your therapy journey</p>
      </div>

      <Card className="bg-gradient-to-r from-ayur-primary to-ayur-secondary text-white">
        <div className="flex items-start gap-4">
          <BookOpen className="w-12 h-12 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{panchakarmaGuide.introduction.title}</h2>
            <p className="text-white/90">{panchakarmaGuide.introduction.content}</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold text-ayur-dark dark:text-white mb-4">Therapy Stages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {panchakarmaGuide.stages.map((stage, index) => (
            <Card key={index} className="border-l-4 border-ayur-primary">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-ayur-primary text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-ayur-dark dark:text-white">{stage.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{stage.description}</p>
              <p className="text-sm text-ayur-primary font-medium">Duration: {stage.duration}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-ayur-dark dark:text-white mb-4">Benefits of Panchakarma</h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {panchakarmaGuide.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Pre-Therapy Care</h2>
          </div>
          <ul className="space-y-2">
            {panchakarmaGuide.preTherapyCare.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-ayur-dark dark:text-white">Post-Therapy Care</h2>
          </div>
          <ul className="space-y-2">
            {panchakarmaGuide.postTherapyCare.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PanchakarmaGuide;
