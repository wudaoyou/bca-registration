package com.tyee.bca_registration.model;

public class Member {
    private String firstName;
    private String lastName;
    private String birthday; // yyyy-mm-dd
    private String club;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getBirthday() { return birthday; }
    public void setBirthday(String birthday) { this.birthday = birthday; }

    public String getClub() { return club; }
    public void setClub(String club) { this.club = club; }
}