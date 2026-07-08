import React, { useState, useEffect } from "react";
import { 
  initialCentres, 
  initialTransfers, 
  calculatePerformanceScore, 
  getActiveAlerts 
} from "./data/mockData";
import { 
  HealthCentre, 
  ResourceTransfer, 
  Language, 
  UserRole, 
  AlertNotification,
  FirestoreUser
} from "./types";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import OverviewDashboard from "./components/OverviewDashboard";
import MapDashboard from "./components/MapDashboard";
import ResourceRedistribution from "./components/ResourceRedistribution";
import InventoryStock from "./components/InventoryStock";
import ClinicalBedMgmt from "./components/ClinicalBedMgmt";
import StaffingAttendance from "./components/StaffingAttendance";
import AiAssistant from "./components/AiAssistant";
import CentreDetailModal from "./components/CentreDetailModal";

// Enterprise Auth imports
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import Onboarding from "./components/Onboarding";
import AccessDenied from "./components/AccessDenied";

import { useI18n } from "./components/I18nProvider";

export default function App() {
  // Central State Hooks
  const { language, changeLanguage: setLanguage } = useI18n();
  const [role, setRole] = useState<UserRole>("DistrictAdmin");
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "redistribution" | "inventory" | "clinical" | "staffing" | "ai">("overview");
  
  const [centres, setCentres] = useState<HealthCentre[]>(initialCentres);
  const [transfers, setTransfers] = useState<ResourceTransfer[]>(initialTransfers);
  
  const [isLargeText, setIsLargeText] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const [selectedCentreId, setSelectedCentreId] = useState<string>("centre-1");
  const [showModal, setShowModal] = useState(false);

  // Recompute active district telemetry notifications whenever centres state updates
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);

  // Enterprise Auth state hooks
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLoginPage, setShowLoginPage] = useState(false);

  useEffect(() => {
    const freshAlerts = getActiveAlerts(centres);
    setAlerts(freshAlerts);
  }, [centres]);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as FirestoreUser;
            setUserProfile(data);
            if (data.language) setLanguage(data.language);
            if (data.role) setRole(data.role);
          } else {
            // New account, trigger onboarding
            setUserProfile({
              uid: fbUser.uid,
              name: fbUser.displayName || "",
              email: fbUser.email || "",
              role: "DistrictAdmin",
              isOnboarded: false
            } as FirestoreUser);
          }
        } catch (e) {
          console.warn("Firestore loading warning, starting demo mode:", e);
          setUserProfile({
            uid: fbUser.uid,
            name: fbUser.displayName || "Roster Officer",
            email: fbUser.email || "officer@nha.gov.in",
            role: "DistrictAdmin",
            roles: ["DistrictAdmin", "PHCAdmin", "Doctor", "LabTech"],
            isOnboarded: true
          } as FirestoreUser);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Automatic role-based redirection
  useEffect(() => {
    if (userProfile && userProfile.isOnboarded) {
      if (role === "DistrictAdmin") {
        setActiveTab("overview");
      } else if (role === "PHCAdmin") {
        setActiveTab("inventory");
      } else if (role === "Doctor") {
        setActiveTab("clinical");
      } else if (role === "LabTech") {
        setActiveTab("clinical");
      }
    }
  }, [role, userProfile?.isOnboarded]);

  const handleOnboardingComplete = async (onboardData: Omit<FirestoreUser, "uid" | "email">) => {
    if (!currentUser) return;
    setIsAuthLoading(true);
    const fullProfile: FirestoreUser = {
      ...onboardData,
      uid: currentUser.uid,
      email: currentUser.email || ""
    };
    try {
      await setDoc(doc(db, "users", currentUser.uid), fullProfile);
      setUserProfile(fullProfile);
      if (fullProfile.language) setLanguage(fullProfile.language);
      if (fullProfile.role) setRole(fullProfile.role);
    } catch (e) {
      console.error("Failed to persist profile:", e);
      setUserProfile(fullProfile);
      if (fullProfile.language) setLanguage(fullProfile.language);
      if (fullProfile.role) setRole(fullProfile.role);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
      setShowLoginPage(false);
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  const handleSwitchActiveRole = async (newRole: UserRole) => {
    setRole(newRole);
    if (currentUser && userProfile) {
      const updated = { ...userProfile, role: newRole };
      setUserProfile(updated);
      try {
        await updateDoc(doc(db, "users", currentUser.uid), { role: newRole });
      } catch (e) {
        console.error("Failed to update preferred role:", e);
      }
    }
  };

  // Tab-to-roles association matrix for Access Control
  const isTabAuthorized = (tab: typeof activeTab, activeRole: UserRole): boolean => {
    switch (tab) {
      case "overview":
      case "map":
      case "ai":
        return true; // accessible to everyone
      case "redistribution":
        return activeRole === "DistrictAdmin";
      case "inventory":
        return activeRole === "DistrictAdmin" || activeRole === "PHCAdmin";
      case "clinical":
        return activeRole === "DistrictAdmin" || activeRole === "Doctor" || activeRole === "LabTech";
      case "staffing":
        return activeRole === "DistrictAdmin" || activeRole === "PHCAdmin";
      default:
        return false;
    }
  };

  // Handler: Select a center and open its full detail modal
  const handleSelectCentre = (centreId: string) => {
    setSelectedCentreId(centreId);
    setShowModal(true);
  };

  const handleSelectCentreIdOnly = (centreId: string) => {
    setSelectedCentreId(centreId);
  };

  // Handler: Navigate to any specific tab
  const handleNavigateToTab = (tab: any) => {
    setActiveTab(tab);
  };

  // Handler: Mark all alerts as read
  const handleMarkAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  // Handler: Clicking alert in header focuses on that clinic
  const handleSelectAlertCentre = (centreId: string) => {
    setSelectedCentreId(centreId);
    setShowModal(true);
  };

  // State-modifier: Approve a smart redistribution recommendations
  const handleApproveTransfer = (rec: Omit<ResourceTransfer, 'id' | 'status' | 'timestamp'>) => {
    const transferId = `tx-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshTx: ResourceTransfer = {
      ...rec,
      id: transferId,
      status: "In Transit",
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    // Deduct stock from the source center's inventory
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === rec.fromCentreId) {
          const updatedInventory = c.inventory.map(item => {
            if (item.name === rec.item) {
              const newQty = Math.max(0, item.quantity - rec.quantity);
              return {
                ...item,
                quantity: newQty,
                daysRemaining: item.avgDailyConsumption > 0 ? newQty / item.avgDailyConsumption : 0
              };
            }
            return item;
          });
          return { ...c, inventory: updatedInventory };
        }
        return c;
      });
    });

    // Add transfer record
    setTransfers(prev => [freshTx, ...prev]);
  };

  // State-modifier: Complete a shipment (arrive at destination, merge inventory)
  const handleCompleteTransfer = (transferId: string) => {
    const tx = transfers.find(t => t.id === transferId);
    if (!tx) return;

    // Update transfer status
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, status: "Completed" };
      }
      return t;
    }));

    // Add stock to target center's inventory
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === tx.toCentreId) {
          const updatedInventory = c.inventory.map(item => {
            if (item.name === tx.item) {
              const newQty = item.quantity + tx.quantity;
              return {
                ...item,
                quantity: newQty,
                daysRemaining: item.avgDailyConsumption > 0 ? newQty / item.avgDailyConsumption : 0
              };
            }
            return item;
          });
          return { ...c, inventory: updatedInventory };
        }
        return c;
      });
    });
  };

  // State-modifier: Manual inventory adjustments (For PHC Administrators)
  const handleUpdateInventory = (centreId: string, itemName: string, newQty: number) => {
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === centreId) {
          const updatedInventory = c.inventory.map(item => {
            if (item.name === itemName) {
              return {
                ...item,
                quantity: newQty,
                daysRemaining: item.avgDailyConsumption > 0 ? newQty / item.avgDailyConsumption : 0
              };
            }
            return item;
          });
          return { ...c, inventory: updatedInventory };
        }
        return c;
      });
    });
  };

  // State-modifier: Bed adjustments (For Doctors)
  const handleUpdateBeds = (centreId: string, bedType: 'icu' | 'emergency' | 'maternity' | 'isolation', newOccupied: number) => {
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === centreId) {
          const targetBed = c.beds[bedType];
          const newAvailable = Math.max(0, targetBed.total - newOccupied);
          return {
            ...c,
            beds: {
              ...c.beds,
              [bedType]: {
                ...targetBed,
                occupied: newOccupied,
                available: newAvailable
              }
            }
          };
        }
        return c;
      });
    });
  };

  // State-modifier: Lab settings & outages (For Lab Technicians)
  const handleUpdateLabTest = (
    centreId: string, 
    testId: string, 
    isAvailable: boolean, 
    waitingTime: number, 
    status: 'Operational' | 'Under Maintenance' | 'Down'
  ) => {
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === centreId) {
          const updatedLabs = c.labTests.map(test => {
            if (test.id === testId) {
              return {
                ...test,
                isAvailable,
                waitingTimeMin: waitingTime,
                equipmentStatus: status
              };
            }
            return test;
          });
          return { ...c, labTests: updatedLabs };
        }
        return c;
      });
    });
  };

  // State-modifier: Doctors/Nurses present check-in increments
  const handleUpdateStaff = (centreId: string, deltaDoctors: number, deltaNurses: number) => {
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        if (c.id === centreId) {
          return {
            ...c,
            availableDoctors: Math.max(0, c.availableDoctors + deltaDoctors),
            nursesOnDuty: Math.max(0, c.nursesOnDuty + deltaNurses)
          };
        }
        return c;
      });
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col items-center justify-center space-y-4" id="auth-loading-screen">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-400">S.Nova</div>
        </div>
        <div className="text-center space-y-1 animate-pulse">
          <p className="text-sm font-extrabold tracking-wider uppercase">Loading Roster Telemetry...</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">National Health Mission Portal</p>
        </div>
      </div>
    );
  }

  // Guest view selection
  if (!currentUser) {
    if (showLoginPage) {
      return (
        <LoginPage 
          language={language} 
          setLanguage={setLanguage} 
          onClose={() => setShowLoginPage(false)} 
          isLargeText={isLargeText}
        />
      );
    }
    return (
      <LandingPage 
        language={language} 
        setLanguage={setLanguage} 
        onOpenLogin={() => setShowLoginPage(true)} 
        isLargeText={isLargeText}
      />
    );
  }

  // Onboarding screen for new accounts
  if (userProfile && !userProfile.isOnboarded) {
    return (
      <Onboarding 
        currentUserEmail={currentUser.email || ""} 
        currentUserId={currentUser.uid} 
        onComplete={handleOnboardingComplete} 
        language={language} 
      />
    );
  }

  const isAuthorized = isTabAuthorized(activeTab, role);

  return (
    <div className={`min-h-screen bg-[#060a13] text-slate-100 flex flex-col font-sans transition-all duration-300 relative overflow-hidden ${
      isLargeText ? "text-base" : "text-sm"
    }`} id="app-root">
      
      {/* Background Ambient Glow Elements for Frosted Glass Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" id="mesh-gradients">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-sky-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Universal Top Header */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={handleSwitchActiveRole}
        isLargeText={isLargeText}
        setIsLargeText={setIsLargeText}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        alerts={alerts}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
        onSelectAlert={handleSelectAlertCentre}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex relative z-10" id="app-body-container">
        
        {/* Universal Sidebar */}
        <Sidebar 
          language={language}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role}
          isLargeText={isLargeText}
        />

        {/* Main Content Stage Viewport */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full" id="viewport-stage">
          
          {!isAuthorized ? (
            <AccessDenied
              requiredRole={
                activeTab === "redistribution" 
                  ? "DistrictAdmin" 
                  : activeTab === "inventory" || activeTab === "staffing" 
                    ? "PHCAdmin" 
                    : "Authorized Staff"
              }
              currentRole={role}
              onBackToAllowed={() => setActiveTab("overview")}
              onSwitchProfile={() => handleSwitchActiveRole(role)}
            />
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewDashboard 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  onSelectCentre={handleSelectCentre}
                  onNavigateToTab={handleNavigateToTab}
                />
              )}

              {activeTab === "map" && (
                <MapDashboard 
                  language={language}
                  centres={centres}
                  transfers={transfers}
                  onSelectCentre={handleSelectCentre}
                  isLargeText={isLargeText}
                />
              )}

              {activeTab === "redistribution" && (
                <ResourceRedistribution 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  transfers={transfers}
                  onApproveTransfer={handleApproveTransfer}
                  onCompleteTransfer={handleCompleteTransfer}
                />
              )}

              {activeTab === "inventory" && (
                <InventoryStock 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  selectedCentreId={selectedCentreId}
                  onSelectCentreId={handleSelectCentreIdOnly}
                  onUpdateInventory={handleUpdateInventory}
                />
              )}

              {activeTab === "clinical" && (
                <ClinicalBedMgmt 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  selectedCentreId={selectedCentreId}
                  onSelectCentreId={handleSelectCentreIdOnly}
                  onUpdateBeds={handleUpdateBeds}
                  onUpdateLabTest={handleUpdateLabTest}
                />
              )}

              {activeTab === "staffing" && (
                <StaffingAttendance 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  selectedCentreId={selectedCentreId}
                  onSelectCentreId={handleSelectCentreIdOnly}
                  onUpdateStaff={handleUpdateStaff}
                />
              )}

              {activeTab === "ai" && (
                <AiAssistant 
                  language={language}
                  role={role}
                  isLargeText={isLargeText}
                  centres={centres}
                  speechEnabled={speechEnabled}
                />
              )}
            </>
          )}

        </main>

      </div>

      {/* Health Center Full Profile Detail Modal */}
      {showModal && (
        <CentreDetailModal 
          language={language}
          role={role}
          centre={centres.find(c => c.id === selectedCentreId) || centres[0]}
          onClose={() => setShowModal(false)}
          isLargeText={isLargeText}
        />
      )}

    </div>
  );
}
