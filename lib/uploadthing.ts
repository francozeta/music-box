// Resource: https://v6.docs.uploadthing.com/api-reference/react#generatereacthelpers

import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from '@/app/api/upload/core'; 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();