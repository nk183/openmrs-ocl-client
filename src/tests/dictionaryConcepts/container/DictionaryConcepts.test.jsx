import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';

import {
  DictionaryConcepts,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/DictionaryConcepts';
import concepts from '../../__mocks__/concepts';

describe('Test suite for dictionary concepts components', () => {
  test('should render without breaking', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
        },
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
    };
    const wrapper = mount(<DictionaryConcepts {...props} />);
    expect(wrapper.find('h2.text-capitalize').text()).toEqual('dev-col Dictionary');

    expect(wrapper).toMatchSnapshot();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        loading: false,
        dictionaryConcepts: [],
        filteredSources: [],
        filteredClass: [],
      },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).filteredClass).toEqual([]);
    expect(mapStateToProps(initialState).filteredSources).toEqual([]);
    expect(mapStateToProps(initialState).loading).toEqual(false);
  });
});
