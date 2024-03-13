"use client";

import React, { useEffect, useState } from "react";
import { capitalizePhrase } from "../includes/commonFunctions";
import {
  writeItemData,
  getItemData,
  getItemId,
  deleteItemData,
} from "../includes/firebaseFunctions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "../components/ui/Select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/Pagination";

import { useToast } from "../components/ui/UseToast";

// Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  itemPrice: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Price must be a positive number.",
  }),
  itemCost: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Cost must be a positive number.",
  }),
  itemStock: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Amount of stock must be a positive number.",
  }),
  itemCategory: z.enum(["snacks", "breakfast", "dish"]),
  itemAddOnsSize: z.enum(["small", "medium", "large"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  itemName: "",
  itemPrice: "",
  itemCost: "",
  itemStock: "",
  itemCategory: undefined,
  itemAddOnsSize: undefined,
};

function ItemList() {
  interface itemListInterface {
    itemId: number;
    itemName: string;
    itemCategory: string;
    itemPrice: number;
    itemCost: number;
    itemStock: number;
    itemAddOns: string;
    itemAddOnsSize: string;
  }

  const { toast } = useToast();
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<number | null>();
  const [itemNameToBeDeleted, setItemNameToBeDeleted] = useState<
    string | null
  >();
  const [itemList, setItemList] = useState<Array<itemListInterface>>([]);

  const rowsPerPage = 10;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [itemList]);

  async function fetchData() {
    const getItemDataResults = await getItemData();

    let itemDataArray: Array<itemListInterface> = [];

    if (getItemDataResults != null) {
      for (let key in getItemDataResults) {
        if (
          getItemDataResults[key].itemId &&
          getItemDataResults[key].itemName &&
          getItemDataResults[key].itemCategory &&
          getItemDataResults[key].itemPrice &&
          getItemDataResults[key].itemCost &&
          getItemDataResults[key].itemStock
        ) {
          itemDataArray.push(getItemDataResults[key]);
        } else {
          for (let key2 in getItemDataResults[key]) {
            if (
              getItemDataResults[key][key2].itemId &&
              getItemDataResults[key][key2].itemName &&
              getItemDataResults[key][key2].itemCategory &&
              getItemDataResults[key][key2].itemPrice &&
              getItemDataResults[key][key2].itemCost &&
              getItemDataResults[key][key2].itemStock
            ) {
              itemDataArray.push(getItemDataResults[key][key2]);
            }
          }
        }
      }

      setItemList(itemDataArray);
    } else {
      setItemList(itemDataArray);
    }

    setItemCount(
      Math.floor(itemDataArray.length / rowsPerPage) * rowsPerPage + rowsPerPage
    );
  }

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  async function handleAddItem(data: FormValues) {
    const getItemIdResults = await getItemId();
    if (getItemIdResults != null) {
      const writeItemDataResult = await writeItemData(
        getItemIdResults + 1,
        data.itemName,
        data.itemCategory,
        Number(data.itemPrice),
        Number(data.itemCost),
        Number(data.itemStock),
        "fries", // todo
        data.itemAddOnsSize === undefined ? "" : data.itemAddOnsSize
      );

      if (writeItemDataResult) {
        toast({
          variant: "success",
          title: "Add Item",
          description: "Successful!",
        });

        fetchData();
        form.reset(defaultValues);
        setFormIsOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Add Item",
          description: "Failed!",
        });
      }
    }
  }

  async function handleDelete() {
    if (itemToBeDeleted) {
      const deleteItemDataResults = await deleteItemData(itemToBeDeleted);
      if (deleteItemDataResults) {
        toast({
          variant: "success",
          title: "Delete Item",
          description: "Successful!",
        });

        fetchData();
        closeDeleteDialog();
      } else {
        toast({
          variant: "destructive",
          title: "Delete Item",
          description: "Failed!",
        });
      }
    }
  }

  function openFormModal() {
    setFormIsOpen(true);
  }

  function openDeleteDialog(itemId: number, itemName: string) {
    setItemToBeDeleted(itemId);
    setItemNameToBeDeleted(itemName);
    setDeleteDialogIsOpen(true);
  }

  function closeDeleteDialog() {
    setItemToBeDeleted(null);
    setItemNameToBeDeleted(null);
    setDeleteDialogIsOpen(false);
  }

  return (
    <div className="pt-10">
      <Button onClick={openFormModal} className="mb-3">
        Add New Item
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Amount in Stock</TableHead>
            <TableHead>Add-ons</TableHead>
            <TableHead>Option</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemList?.slice(startIndex, endIndex)?.map((item) =>
            item.itemId ? (
              <TableRow key={item.itemId}>
                <TableCell>{item.itemId}</TableCell>
                <TableCell className="font-medium">
                  {capitalizePhrase(item.itemName)}
                </TableCell>
                <TableCell>{capitalizePhrase(item.itemCategory)}</TableCell>
                <TableCell className="text-right">{item.itemPrice}</TableCell>
                <TableCell className="text-right">{item.itemCost}</TableCell>
                <TableCell className="text-right">{item.itemStock}</TableCell>
                <TableCell>
                  {item.itemAddOnsSize
                    ? capitalizePhrase(item.itemAddOns) +
                      "(" +
                      capitalizePhrase(item.itemAddOnsSize) +
                      ")"
                    : ""}
                </TableCell>
                <TableCell>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                    data-state="closed"
                    onClick={() => openDeleteDialog(item.itemId, item.itemName)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                    <span className="sr-only">Move to trash</span>
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              ""
            )
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={
                startIndex === 0 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                setStartIndex(startIndex - rowsPerPage);
                setEndIndex(endIndex - rowsPerPage);
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                endIndex === itemCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                setStartIndex(startIndex + rowsPerPage);
                setEndIndex(endIndex + rowsPerPage);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={formIsOpen} onOpenChange={setFormIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddItem)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Item price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="Item cost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount of Stock</FormLabel>
                    <FormControl>
                      <Input placeholder="Item stock" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          {field.value ? (
                            <SelectValue placeholder="Select category" />
                          ) : (
                            "Select category"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={1} value="snacks">
                          {capitalizePhrase("snacks")}
                        </SelectItem>
                        <SelectItem key={2} value="breakfast">
                          {capitalizePhrase("breakfast")}
                        </SelectItem>
                        <SelectItem key={3} value="dish">
                          {capitalizePhrase("dish")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemAddOnsSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add-Ons</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          {field.value ? (
                            <SelectValue placeholder="Select Add-Ons" />
                          ) : (
                            "Select Add-Ons"
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fries</SelectLabel>
                          <SelectItem key={1} value="small">
                            {capitalizePhrase("small")}
                          </SelectItem>
                          <SelectItem key={2} value="medium">
                            {capitalizePhrase("medium")}
                          </SelectItem>
                          <SelectItem key={3} value="large">
                            {capitalizePhrase("large")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className=" mr-2">
                Submit
              </Button>

              <Button
                type="reset"
                variant="secondary"
                onClick={() => form.reset(defaultValues)}
              >
                Clear
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogIsOpen} onOpenChange={setDeleteDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete item {itemNameToBeDeleted}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" onClick={handleDelete}>
              Yes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={closeDeleteDialog}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ItemList;
