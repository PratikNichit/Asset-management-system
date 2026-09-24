import { useState, useMemo, useRef } from 'react';
import type { Asset, AssetStatus } from '../types/asset';
import { useAppSelector } from '../app/hooks';
import { selectAllCategories } from '../redux/categoriesSlice';
import { selectAllDepartments } from '../redux/departmentsSlice';
import { selectAllLocations } from '../redux/locationsSlice';
import { selectAllEmployeesList } from '../redux/employeesSlice';
import { selectAllAssets, getNextAssetId } from '../redux/assetsSlice';

export const STEPS = [
  { label: 'Basic details', helper: 'Name & identifiers' },
  { label: 'Purchase', helper: 'Cost & warranty' },
  { label: 'Assignment', helper: 'Who & where' },
  { label: 'Media', helper: 'Photos & files' },
  { label: 'Review', helper: 'Confirm & create' },
];

export function useNewAssetForm(onSuccess?: (newAsset: Asset) => void | Promise<void>, onCancel?: () => void) {
  const reduxCategories = useAppSelector(selectAllCategories);
  const reduxDepartments = useAppSelector(selectAllDepartments);
  const reduxLocations = useAppSelector(selectAllLocations);
  const reduxEmployees = useAppSelector(selectAllEmployeesList);
  const reduxAssets = useAppSelector(selectAllAssets);

  // Step control
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form State — Basic
  const [assetName, setAssetName] = useState('');
  
  const assetId = useMemo(() => getNextAssetId(reduxAssets), [reduxAssets]);
  
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
    if (!department) errors[2].department = 'Select a department.';
    if (!location) errors[2].location = 'Select a location.';
    return errors;
  }, [assetName, category, purchaseCost, purchaseDate, warrantyUntil, department, location]);

  const stepIsValid = (step: number) => Object.keys(stepErrors[step] ?? {}).length === 0;
  const showError = (step: number, field: string) => touched[field] && stepErrors[step]?.[field];

  const goToStep = (step: number) => {
    if (step <= furthestStep) setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep === 0) setTouched((t) => ({ ...t, assetName: true, category: true }));
    if (activeStep === 1) setTouched((t) => ({ ...t, purchaseCost: true, warrantyUntil: true }));
    if (activeStep === 2) setTouched((t) => ({ ...t, department: true, location: true }));
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

  const buildAsset = (): Asset => {
    const catName = reduxCategories.find(c => c.id === category)?.name || 'General';
    const deptName = reduxDepartments.find(d => d.id === department)?.name || 'Unassigned';
    const locName = reduxLocations.find(l => l.id === location)?.name || 'HQ — Bengaluru';
    const empName = reduxEmployees.find(e => e.id === assignedEmployee)?.name || null;

    return {
      id: assetId,
      code: assetId,
      name: assetName.trim() || 'Untitled Asset',
      category: catName,
      categoryId: category || undefined,
      serial: serialNumber.trim() || 'N/A',
      department: deptName,
      departmentId: department || undefined,
      location: locName,
      locationId: location || undefined,
      assignedTo: empName,
      assignedToId: assignedEmployee !== 'Unassigned' ? assignedEmployee : null,
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
    };
  };

  const handleCreate = async () => {
    setTouched((t) => ({ ...t, assetName: true, category: true, department: true, location: true }));
    const firstInvalidStep = [0, 1, 2].find((step) => !stepIsValid(step));
    if (firstInvalidStep !== undefined) {
      setActiveStep(firstInvalidStep);
      setToastMessage('Please complete the required fields before creating this asset.');
      return;
    }

    const createdAsset = buildAsset();
    try {
      if (onSuccess) await onSuccess(createdAsset);
      else if (onCancel) onCancel();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Failed to create asset.');
    }
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
