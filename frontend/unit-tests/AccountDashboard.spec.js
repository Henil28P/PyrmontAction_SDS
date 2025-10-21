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

    // Check appropriate validation of email and password fields
    it('validates email and password fields', async () => {
        const wrapper = mount(EditAccountDetailsModal, { props: { userData: mockUser } })
        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.text()).toContain('required')
    });

    // Confirm successful form submission calls API and emits event
    it('submits updated details successfully', async () => {
        const wrapper = mount(EditAccountDetailsModal, {
            props: { userData: mockUser },
            global: { plugins: [createPinia()] } // <-- activate Pinia here
        });
    });
});
