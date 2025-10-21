vi.mock("../../frontend/src/features/accountDashboard/dashboardServices", () => ({
  default: {
    updateCurrentUser: vi.fn().mockResolvedValue({ email: 'updated@example.com' })
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import EditAccountDetailsModal from "../../frontend/src/features/accountDashboard/components/EditAccountDetailsModal.vue";
// import services from '@/features/accountDashboard/dashboardServices'
import { createPinia } from 'pinia';

describe('EditAccountDetailsModal.vue', () => {
    const mockUser = { email: 'Amy.Green@gmail.com' }

    // Verify initial rendering of email
    it('renders initial user email', () => {
        const wrapper = mount(EditAccountDetailsModal, {
          props: { userData: mockUser },
          global: { plugins: [createPinia()] } // <-- activate Pinia here
        });
        expect(wrapper.find('#email').element.value).toBe('Amy.Green@gmail.com')
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
        // set inputs instead of setData
        await wrapper.find('#email').setValue('Amy.Green@gmail.com');
        await wrapper.find('#password').setValue('12345678');
        await wrapper.find('form').trigger('submit.prevent');
    });

    // Ensure updateCurrentUser service called on valid form submission
    it('calls updateCurrentUser service when valid form is submitted', async () => {
        const wrapper = mount(EditAccountDetailsModal, {
            props: { userData: mockUser },
            global: { plugins: [createPinia()] }
        });
        await wrapper.find('#email').setValue('Amy.updated@example.com');
        await wrapper.find('#password').setValue('12345678');
        await wrapper.find('form').trigger('submit.prevent');

        // use dynamic import assertion to updateCurrentUser
        const svc = await import('../../frontend/src/features/accountDashboard/dashboardServices');
        expect(svc.default.updateCurrentUser).toHaveBeenCalled();
    });
});
