package com.urjatrack.backend.dto;

public class LogReadingRequest {
    private Double readingValue;
    private String note;
    
    public LogReadingRequest() {}
    
    public Double getReadingValue() {
        return readingValue;
    }
    
    public void setReadingValue(Double readingValue) {
        this.readingValue = readingValue;
    }
    
    public String getNote() {
        return note;
    }
    
    public void setNote(String note) {
        this.note = note;
    }
}
