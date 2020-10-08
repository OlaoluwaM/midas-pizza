import React from 'react'
import styled from 'styled-components';

import {toast} from 'react-toastify';
import { m as motion } from 'framer-motion';
import { generateFetchOptions } from './local-utils/helpers';

//TODO complete this
export default function Settings() {

  const saveChanges = async (data) => {
    fetchWrapper(generateUrl(`users?email=${}`), generateFetchOptions('PUT', {}, token))
  }
}
