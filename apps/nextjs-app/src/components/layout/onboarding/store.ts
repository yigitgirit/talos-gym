import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OnboardingState {
  clubId: number | null;
  clubSlug: string | null;
  offerId: number | null;
  subscriptionTypeId: number | null;
  
  setClub: (id: number, slug: string) => void;
  setOfferId: (id: number) => void;
  setSubscriptionTypeId: (id: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      clubId: null,
      clubSlug: null,
      offerId: null,
      subscriptionTypeId: null,

      setClub: (id, slug) => set({ clubId: id, clubSlug: slug, offerId: null, subscriptionTypeId: null }),
      setOfferId: (id) => set({ offerId: id }),
      setSubscriptionTypeId: (id) => set({ subscriptionTypeId: id }),
      reset: () => set({ clubId: null, clubSlug: null, offerId: null, subscriptionTypeId: null }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
