import { useState, useMemo, useRef } from 'react';
import type { Asset, AssetStatus } from '../types/asset';

export const STEPS = [
  { label: 'Basic details', helper: 'Name & identifiers' },
  { label: 'Purchase', helper: 'Cost & warranty' },
  { label: 'Assignment', helper: 'Who & where' },
  { label: 'Media', helper: 'Photos & files' },
  { label: 'Review', helper: 'Confirm & create' },
];

export function useNewAssetForm(onSuccess?: (newAsset: Asset) => void, onCancel?: () => void) {
  // Step control
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form State — Basic
  const [assetName, setAssetName] = useState('');
  const [assetId] = useState('AST-01301');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  // Purchase & Warranty State
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [vendor, setVendor] = useState('');
  const [warrantyUntil, setWarrantyUntil] = useState('');

  // Assignment State
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('Unassigned');
  const [status, setStatus] = useState<AssetStatus>('Available');

  // Description
  const [description, setDescription] = useState('');

  // Media State
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const stepErrors = useMemo(() => {
    const errors: Record<number, Record<string, string>> = { 0: {}, 1: {}, 2: {}, 3: {} };
    if (!assetName.trim()) errors[0].assetName = 'Asset name is required.';
    if (!category) errors[0].category = 'Select a category.';
    if (purchaseCost && Number.isNaN(Number(purchaseCost))) errors[1].purchaseCost = 'Enter a valid amount.';
    if (purchaseDate && warrantyUntil && warrantyUntil < purchaseDate) {
      errors[1].warrantyUntil = 'Warranty date is before the purchase date.';
    }
    return errors;
  }, [assetName, category, purchaseCost, purchaseDate, warrantyUntil]);

  const stepIsValid = (step: number) => Object.keys(stepErrors[step] ?? {}).length === 0;
  const showError = (step: number, field: string) => touched[field] && stepErrors[step]?.[field];

  const goToStep = (step: number) => {
    if (step <= furthestStep) setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep === 0) setTouched((t) => ({ ...t, assetName: true, category: true }));
    if (activeStep === 1) setTouched((t) => ({ ...t, purchaseCost: true, warrantyUntil: true }));
    if (!stepIsValid(activeStep)) return;
    const next = Math.min(activeStep + 1, STEPS.length - 1);
    setActiveStep(next);
    setFurthestStep((f) => Math.max(f, next));
  };

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  // Media handlers
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map((f) => f.name);
      setDocuments((prev) => [...prev, ...newDocs]);
      setToastMessage(`Uploaded document: ${files[0].name}`);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const buildAsset = (): Asset => ({
    id: assetId,
    code: assetId,
    name: assetName.trim() || 'Untitled Asset',
    category: category || 'General',
    serial: serialNumber.trim() || 'N/A',
    department: department || 'Unassigned',
    location: location || 'HQ — Bengaluru',
    assignedTo: assignedEmployee !== 'Unassigned' ? assignedEmployee : null,
    warrantyExpiry: warrantyUntil || null,
    status,
    brand: brand.trim() || undefined,
    model: model.trim() || undefined,
    purchaseDate: purchaseDate || undefined,
    purchaseCost: Number(purchaseCost) || 0,
    vendor: vendor.trim() || undefined,
    description: description.trim() || undefined,
    images,
    documents,
  });

  const handleCreate = () => {
    setTouched((t) => ({ ...t, assetName: true, category: true }));
    if (!stepIsValid(0)) {
      setActiveStep(0);
      setToastMessage('Please complete the required fields before creating this asset.');
      return;
    }
    const createdAsset = buildAsset();
    if (onSuccess) onSuccess(createdAsset);
    else if (onCancel) onCancel();
  };

  const handleSaveDraft = () => {
    setToastMessage('Draft saved successfully.');
  };

  return {
    state: {
      activeStep,
      furthestStep,
      touched,
      assetName,
      assetId,
      serialNumber,
      category,
      brand,
      model,
      purchaseDate,
      purchaseCost,
      vendor,
      warrantyUntil,
      department,
      location,
      assignedEmployee,
      status,
      description,
      images,
      documents,
      toastMessage,
    },
    refs: {
      imageInputRef,
      docInputRef,
    },
    setters: {
      setAssetName,
      setSerialNumber,
      setCategory,
      setBrand,
      setModel,
      setPurchaseDate,
      setPurchaseCost,
      setVendor,
      setWarrantyUntil,
      setDepartment,
      setLocation,
      setAssignedEmployee,
      setStatus,
      setDescription,
      setToastMessage,
      setTouched,
    },
    handlers: {
      showError,
      goToStep,
      handleNext,
      handleBack,
      handleRemoveImage,
      handleImageUpload,
      handleDocumentUpload,
      handleRemoveDocument,
      handleCreate,
      handleSaveDraft,
    },
  };
}
