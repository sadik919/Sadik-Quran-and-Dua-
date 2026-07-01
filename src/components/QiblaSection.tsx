import { useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations';
import { Compass, Navigation, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function QiblaSection() {
  const { currentLanguage } = useTranslation();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number>(119); // Default Qibla from Dhaka is ~119 degrees
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Formula to calculate Qibla angle from coordinates
  const calculateQibla = (lat1: number, lng1: number) => {
    // Kaaba Coordinates
    const lat2 = 21.4225 * (Math.PI / 180);
    const lng2 = 39.8262 * (Math.PI / 180);

    const phi1 = lat1 * (Math.PI / 180);
    const lambda1 = lng1 * (Math.PI / 180);

    const y = Math.sin(lng2 - lambda1);
    const x = Math.cos(phi1) * Math.tan(lat2) - Math.sin(phi1) * Math.cos(lng2 - lambda1);

    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;
    return Math.round(qibla);
  };

  const requestLocation = () => {
    setIsLocating(true);
    setErrorMsg("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          const calculated = calculateQibla(latitude, longitude);
          setQiblaAngle(calculated);
          setIsLocating(false);
        },
        () => {
          setErrorMsg(
            currentLanguage === 'Bangla'
              ? "জিপিএস অনুমতি দেওয়া হয়নি বা পাওয়া যায়নি। দক্ষিণ-পশ্চিমের ডিফল্ট কিবলা কোণ (~১১৯°) ব্যবহার করা হচ্ছে।"
              : "GPS permission denied or unavailable. Defaulting to general South-West direction (~119°)."
          );
          setIsLocating(false);
        }
      );
    } else {
      setErrorMsg(
        currentLanguage === 'Bangla'
          ? "আপনার ব্রাউজারে জিপিএস সমর্থিত নয়।"
          : "Geolocation is not supported by your browser."
      );
      setIsLocating(false);
    }
  };

  // Listen to DeviceOrientation API for Compass heading
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is available on iOS devices
      if ((e as any).webkitCompassHeading !== undefined) {
        setDeviceHeading((e as any).webkitCompassHeading);
      } else if (e.alpha !== null) {
        // alpha represents rotation around z-axis (0 to 360)
        setDeviceHeading(360 - e.alpha);
      }
    };

    // Request device orientation permission for iOS 13+
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Compute needle rot: Qibla angle relative to current device heading
  const needleRotation = (qiblaAngle - deviceHeading + 360) % 360;

  return (
    <div id="qibla-section" className="space-y-6">
      {/* Dynamic Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden text-center">
        <div className="relative z-10 space-y-1">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase block">
            {currentLanguage === 'Bangla' ? 'মক্কা দিক নির্দেশক' : 'Makkah Direction Finder'}
          </span>
          <h3 className="text-2xl font-serif font-bold text-amber-200">{currentLanguage === 'Bangla' ? 'কিবলা কম্পাস' : 'Qibla Compass'}</h3>
          <p className="text-emerald-100 text-xs px-4">
            {currentLanguage === 'Bangla'
              ? 'সঠিক পরিমাপের জন্য আপনার ফোনটি সমতল স্থানে রাখুন এবং যেকোনো ধাতব বা চৌম্বকীয় বস্তু থেকে দূরে থাকুন।'
              : 'Place your phone flat on a horizontal surface. Ensure you are away from metal or magnetic objects for accuracy.'}
          </p>
        </div>
      </div>

      {/* Geolocation Controls */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-755 dark:text-white block">
              {currentLanguage === 'Bangla' ? 'জিপিএস অবস্থান' : 'GPS Geolocation'}
            </span>
            {coords ? (
              <p className="text-slate-450 dark:text-slate-505 font-mono">Lat: {coords.lat.toFixed(4)} • Lng: {coords.lng.toFixed(4)}</p>
            ) : (
              <p className="text-slate-450 dark:text-slate-505">
                {currentLanguage === 'Bangla' ? 'জিপিএস যুক্ত নেই' : 'Not connected to GPS'}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={requestLocation}
          className={`px-3 py-2 bg-emerald-850 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${isLocating ? 'opacity-80' : ''}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          {coords 
            ? (currentLanguage === 'Bangla' ? 'পুনরায় গণনা' : 'Recalculate') 
            : (currentLanguage === 'Bangla' ? 'অবস্থান সিঙ্ক করুন' : 'Sync Location')}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Visual Compass Canvas */}
      <div className="flex flex-col items-center justify-center py-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 shadow-sm">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Compass Rose */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-750 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/40">
            {/* Cardinal direction indicators */}
            <span className="absolute top-2.5 text-xs font-bold text-red-500 font-mono">N</span>
            <span className="absolute right-3.5 text-xs font-bold text-slate-450 font-mono">E</span>
            <span className="absolute bottom-2.5 text-xs font-bold text-slate-450 font-mono">S</span>
            <span className="absolute left-3.5 text-xs font-bold text-slate-450 font-mono">W</span>
          </div>

          {/* Qibla Angle indicator (The Golden Pointer to Kaaba) */}
          <motion.div
            id="compass-qibla-pointer"
            className="absolute w-52 h-52 rounded-full border border-dashed border-amber-400/40"
            style={{ transform: `rotate(${needleRotation}deg)` }}
            animate={{ rotate: needleRotation }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            {/* Golden Arrow Pointer pointing directly to Qibla */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 flex flex-col items-center">
              <Navigation className="w-8 h-8 text-amber-500 fill-current" />
              <span className="text-[9px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full mt-0.5 shadow">
                {currentLanguage === 'Bangla' ? 'কাবা' : 'KAABA'}
              </span>
            </div>
          </motion.div>

          {/* Compass Inner Needle representing current device orientation */}
          <motion.div
            id="compass-north-pointer"
            className="w-1.5 h-44 bg-gradient-to-b from-red-500 via-slate-400 to-slate-400 rounded-full relative z-10"
            style={{ transform: `rotate(${-deviceHeading}deg)` }}
            animate={{ rotate: -deviceHeading }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full"></div>
          </motion.div>

          {/* Center cap */}
          <div className="absolute w-6 h-6 bg-slate-100 dark:bg-slate-750 rounded-full shadow border-4 border-white dark:border-slate-800 z-20"></div>
        </div>

        {/* Degree Readouts */}
        <div className="grid grid-cols-2 gap-8 text-center mt-6 w-full max-w-xs border-t border-slate-100 dark:border-slate-700/60 pt-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">
              {currentLanguage === 'Bangla' ? 'কিবলার দিক কোণ' : 'Qibla Direction'}
            </span>
            <p className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-400">{qiblaAngle}° N</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-555">
              {currentLanguage === 'Bangla' ? 'ডিভাইসের দিক কোণ' : 'Device Heading'}
            </span>
            <p className="text-xl font-mono font-black text-slate-800 dark:text-white">{Math.round(deviceHeading)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
}
