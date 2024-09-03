import { TestBed } from '@angular/core/testing';

import { CloudinaryService } from './cloudinary-signature.service';

describe('CloudinarySignatureService', () => {
  let service: CloudinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
