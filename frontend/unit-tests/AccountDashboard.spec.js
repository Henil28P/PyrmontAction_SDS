// import { mount } from '@vue/test-utils'
// import { describe, it, expect, vi } from 'vitest'
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import EditAccountDetailsModal from "../../frontend/src/features/accountDashboard/components/EditAccountDetailsModal.vue";
import services from '@/features/accountDashboard/dashboardServices'
import { createPinia } from 'pinia';

vi.mock("../../frontend/src/features/accountDashboard/dashboardServices", () => ({
  default: {
    updateCurrentUser: vi.fn().mockResolvedValue({ email: 'updated@example.com' })
  },
}));

describe('EditAccountDetailsModal.vue', () => {
    const mockUser = { email: 'Amy.Green@example.com' }

    // Verify initial rendering of email
    it('renders initial user email', () => {
        const wrapper = mount(EditAccountDetailsModal, {
          props: { userData: mockUser },
          global: { plugins: [createPinia()] } // <-- activate Pinia here
        });
        expect(wrapper.find('#email').element.value).toBe('Amy.Green@example.com')
    });
})
