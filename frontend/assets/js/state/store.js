// Global app state
let state = {
  students: [],
  teachers: [],
  marks: [],
  editingId: null,
  teacherEditingId: null,
  markEditingId: null,
  profileStudentId: null  // Store the student ID for profile page
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}