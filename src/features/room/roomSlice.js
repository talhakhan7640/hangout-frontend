import { createSlice } from "@reduxjs/toolkit";

export const roomSlice = createSlice({
    name: 'setRoomNameForChatPanel',
    initialState:{
        value: ''
    },
    reducers: {
        setRoomNameForChatPanel: (state, action) => {
            state.value= action.payload
        }
    }
})

export const {setRoomNameForChatPanel} = roomSlice.actions;
export default roomSlice.reducer;