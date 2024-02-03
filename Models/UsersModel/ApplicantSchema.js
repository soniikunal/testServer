import { Schema, model } from "mongoose";

const applicantSchema = new Schema({
  aadharNumber: { type: String },
  AppID: { type: String },
  appliedInFusion: { type: Boolean, default: false },
  currentAddress: {
    address: { type: String },
    state: { type: String },
    city: { type: String },
    pin: { type: String },
  },
  dateOfApplication: { type: Date },
  dateOfInterview: { type: Date },
  department: { type: String },
  dob: { type: Date },
  email: { type: String },
  fatherName: { type: String },
  firstName: { type: String },
  gender: { type: String },
  graduation: {
    course: { type: String },
  },
  internship: { type: [String], default: [] },
  jobportalname: { type: String },
  lastName: { type: String },
  maritalStatus: { type: String },
  name: { type: String },
  nightShift: { type: Boolean, default: false },
  number: { type: String },
  otherCertification: {
    course: { type: String },
  },
  permanentAddress: {
    address: { type: String },
    state: { type: String },
    city: { type: String },
    pin: { type: String },
  },
  phone: { type: String },
  photo: { type: String },
  position: { type: String },
  postGraduation: {
    course: { type: String },
  },
  resume: { type: String },
  referral : {
    name : { type: String },
    designation : { type: String },
    number : { type: Number }
  },
  source: { type: String },
  team: { type: [String], default: [] },
  tenth: {
    name: { type: String },
    board: { type: String },
    percentage: { type: String },
    year: { type: Number },
  },
  twelfth: {
    name: { type: String },
    board: { type: String },
    percentage: { type: String },
    year: { type: Number },
  },
  utmsource: { type: String },
  we1: {
    name: { type: String },
    department: { type: String },
    role: { type: String },
    salary: { type: String },
    experience: { type: String },
  },
  we2: {
    name: { type: String },
    department: { type: String },
    role: { type: String },
    salary: { type: String },
    experience: { type: String },
  },
});

export default model("Applicant", applicantSchema);