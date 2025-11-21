import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createShallowWrapper } from '@/test-utils'
import MetricList from '../MetricList.vue'
import * as useApiModule from '../../../../composables/useApi'

describe('MetricList.vue', () => {
  const defaultMocks = {
    $route: {
      path: '/metrics',
      params: {},
      query: {},
      hash: '',
      name: 'app.metric.list',
    },
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  }

  // Mock the useApi composable
  const mockGet = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock useApi to prevent API calls
    vi.spyOn(useApiModule, 'useApi').mockReturnValue({
      get: mockGet,
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      del: vi.fn(),
    })
    
    // Mock successful API response
    mockGet.mockResolvedValue({
      data: {
        data: [],
        has_more: false,
        last_key: null,
        first_key: null,
      },
    })
  })

  it('renders the component', () => {
    const wrapper = createShallowWrapper(MetricList, {
      global: {
        mocks: defaultMocks,
        stubs: {
          LoadingScreen: true,
          FiltersSection: true,
          RoleOnlyView: true,
          InternalApp: true,
          Dropdown: true,
          ListGroup: true,
          ListGroupItem: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('has correct initial data state', () => {
    const wrapper = createShallowWrapper(MetricList, {
      global: {
        mocks: defaultMocks,
        stubs: {
          LoadingScreen: true,
          FiltersSection: true,
          RoleOnlyView: true,
          InternalApp: true,
          Dropdown: true,
          ListGroup: true,
          ListGroupItem: true,
        },
      },
    })

    expect(wrapper.vm.ready).toBe(false)
    expect(wrapper.vm.loaded).toBe(false)
    expect(wrapper.vm.has_error).toBe(false)
    expect(wrapper.vm.metrics).toEqual([])
    expect(wrapper.vm.per_page).toBe('10')
  })

  it('has correct filters configuration', () => {
    const wrapper = createShallowWrapper(MetricList, {
      global: {
        mocks: defaultMocks,
        stubs: {
          LoadingScreen: true,
          FiltersSection: true,
          RoleOnlyView: true,
          InternalApp: true,
          Dropdown: true,
          ListGroup: true,
          ListGroupItem: true,
        },
      },
    })

    expect(wrapper.vm.filters).toHaveProperty('name')
    expect(wrapper.vm.filters.name.label).toBe('app.metric.list.filter.name')
    expect(wrapper.vm.filters.name.type).toBe('text')
  })

  it('has correct pagination properties', () => {
    const wrapper = createShallowWrapper(MetricList, {
      global: {
        mocks: defaultMocks,
        stubs: {
          LoadingScreen: true,
          FiltersSection: true,
          RoleOnlyView: true,
          InternalApp: true,
          Dropdown: true,
          ListGroup: true,
          ListGroupItem: true,
        },
      },
    })

    expect(wrapper.vm.has_more).toBe(false)
    expect(wrapper.vm.show_back).toBe(false)
    expect(wrapper.vm.next_page_in_progress).toBe(false)
  })
})
