package com.abc.clientecrud.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.Objects;

@MappedSuperclass
public class BaseEntity implements Serializable {
  private static final long serialVersionUID = 1;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  protected Long id;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(id);
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    } else if (other == null || this.getClass() != other.getClass()) {
      return false;
    } else {
      BaseEntity otherEntity = (BaseEntity) other;
      return Objects.equals(id, otherEntity.id);
    }
  }
}
